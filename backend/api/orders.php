<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

class OrderAPI {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function createOrder($data) {
        try {
            $this->conn->beginTransaction();
            
            // Generate order number
            $orderNumber = 'TP' . date('Ymd') . sprintf('%04d', rand(1, 9999));
            
            // Calculate estimated delivery (45 minutes from now)
            $estimatedDelivery = date('Y-m-d H:i:s', strtotime('+45 minutes'));
            
            // Insert order
            $orderQuery = "INSERT INTO orders (
                user_id, order_number, subtotal, tax, delivery_fee, total,
                contact_first_name, contact_last_name, contact_email, contact_phone,
                delivery_street, delivery_city, delivery_state, delivery_zip_code,
                special_instructions, estimated_delivery
            ) VALUES (
                :user_id, :order_number, :subtotal, :tax, :delivery_fee, :total,
                :contact_first_name, :contact_last_name, :contact_email, :contact_phone,
                :delivery_street, :delivery_city, :delivery_state, :delivery_zip_code,
                :special_instructions, :estimated_delivery
            )";
            
            $orderStmt = $this->conn->prepare($orderQuery);
            $orderStmt->bindParam(':user_id', $data['userId']);
            $orderStmt->bindParam(':order_number', $orderNumber);
            $orderStmt->bindParam(':subtotal', $data['subtotal']);
            $orderStmt->bindParam(':tax', $data['tax']);
            $orderStmt->bindParam(':delivery_fee', $data['deliveryFee']);
            $orderStmt->bindParam(':total', $data['total']);
            $orderStmt->bindParam(':contact_first_name', $data['contactInfo']['firstName']);
            $orderStmt->bindParam(':contact_last_name', $data['contactInfo']['lastName']);
            $orderStmt->bindParam(':contact_email', $data['contactInfo']['email']);
            $orderStmt->bindParam(':contact_phone', $data['contactInfo']['phone']);
            $orderStmt->bindParam(':delivery_street', $data['deliveryAddress']['street']);
            $orderStmt->bindParam(':delivery_city', $data['deliveryAddress']['city']);
            $orderStmt->bindParam(':delivery_state', $data['deliveryAddress']['state']);
            $orderStmt->bindParam(':delivery_zip_code', $data['deliveryAddress']['zipCode']);
            $orderStmt->bindParam(':special_instructions', $data['specialInstructions']);
            $orderStmt->bindParam(':estimated_delivery', $estimatedDelivery);
            
            $orderStmt->execute();
            $orderId = $this->conn->lastInsertId();
            
            // Insert order items
            $itemQuery = "INSERT INTO order_items (order_id, pizza_id, size, quantity, unit_price, total_price, special_instructions) 
                          VALUES (:order_id, :pizza_id, :size, :quantity, :unit_price, :total_price, :special_instructions)";
            $itemStmt = $this->conn->prepare($itemQuery);
            
            foreach ($data['items'] as $item) {
                $unitPrice = $item['pizza']['prices'][$item['size']];
                $totalPrice = $unitPrice * $item['quantity'];
                
                $itemStmt->bindParam(':order_id', $orderId);
                $itemStmt->bindParam(':pizza_id', $item['pizza']['id']);
                $itemStmt->bindParam(':size', $item['size']);
                $itemStmt->bindParam(':quantity', $item['quantity']);
                $itemStmt->bindParam(':unit_price', $unitPrice);
                $itemStmt->bindParam(':total_price', $totalPrice);
                $itemStmt->bindParam(':special_instructions', $item['specialInstructions']);
                $itemStmt->execute();
            }
            
            $this->conn->commit();
            
            return array(
                "success" => true,
                "message" => "Order created successfully",
                "orderId" => $orderId,
                "orderNumber" => $orderNumber,
                "estimatedDelivery" => $estimatedDelivery
            );
            
        } catch (Exception $e) {
            $this->conn->rollback();
            return array("success" => false, "message" => "Order creation failed: " . $e->getMessage());
        }
    }
    
    public function getOrders($userId = null) {
        $query = "SELECT o.*, 
                  COUNT(oi.id) as item_count,
                  GROUP_CONCAT(CONCAT(p.name, ' (', oi.size, ') x', oi.quantity) SEPARATOR ', ') as items_summary
                  FROM orders o
                  LEFT JOIN order_items oi ON o.id = oi.order_id
                  LEFT JOIN pizzas p ON oi.pizza_id = p.id";
        
        if ($userId) {
            $query .= " WHERE o.user_id = :user_id";
        }
        
        $query .= " GROUP BY o.id ORDER BY o.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        if ($userId) {
            $stmt->bindParam(':user_id', $userId);
        }
        $stmt->execute();
        
        $orders = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $order = array(
                "id" => (int)$row['id'],
                "orderNumber" => $row['order_number'],
                "status" => $row['status'],
                "subtotal" => (float)$row['subtotal'],
                "tax" => (float)$row['tax'],
                "deliveryFee" => (float)$row['delivery_fee'],
                "total" => (float)$row['total'],
                "estimatedDelivery" => $row['estimated_delivery'],
                "createdAt" => $row['created_at'],
                "itemCount" => (int)$row['item_count'],
                "itemsSummary" => $row['items_summary'],
                "contactInfo" => array(
                    "firstName" => $row['contact_first_name'],
                    "lastName" => $row['contact_last_name'],
                    "email" => $row['contact_email'],
                    "phone" => $row['contact_phone']
                ),
                "deliveryAddress" => array(
                    "street" => $row['delivery_street'],
                    "city" => $row['delivery_city'],
                    "state" => $row['delivery_state'],
                    "zipCode" => $row['delivery_zip_code']
                )
            );
            array_push($orders, $order);
        }
        
        return $orders;
    }
    
    public function updateOrderStatus($orderId, $status) {
        $validStatuses = ['pending', 'confirmed', 'preparing', 'baking', 'out-for-delivery', 'delivered', 'cancelled'];
        
        if (!in_array($status, $validStatuses)) {
            return array("success" => false, "message" => "Invalid status");
        }
        
        $query = "UPDATE orders SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $orderId);
        
        if ($stmt->execute()) {
            return array("success" => true, "message" => "Order status updated successfully");
        } else {
            return array("success" => false, "message" => "Failed to update order status");
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$api = new OrderAPI();

switch($method) {
    case 'GET':
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        echo json_encode($api->getOrders($userId));
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($api->createOrder($data));
        break;
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $orderId = isset($_GET['id']) ? $_GET['id'] : null;
        if ($orderId && isset($data['status'])) {
            echo json_encode($api->updateOrderStatus($orderId, $data['status']));
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Order ID and status are required"));
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}
?>