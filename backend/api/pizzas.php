<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

class PizzaAPI {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function getPizzas() {
        $query = "SELECT p.*, c.name as category_name,
                  GROUP_CONCAT(pi.ingredient SEPARATOR ', ') as ingredients
                  FROM pizzas p 
                  LEFT JOIN categories c ON p.category_id = c.id
                  LEFT JOIN pizza_ingredients pi ON p.id = pi.pizza_id
                  WHERE p.is_active = TRUE
                  GROUP BY p.id
                  ORDER BY p.name";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $pizzas = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $pizza = array(
                "id" => (int)$row['id'],
                "name" => $row['name'],
                "description" => $row['description'],
                "image" => $row['image_url'],
                "category" => $row['category_name'],
                "prices" => array(
                    "small" => (float)$row['price_small'],
                    "medium" => (float)$row['price_medium'],
                    "large" => (float)$row['price_large']
                ),
                "ingredients" => $row['ingredients'] ? explode(', ', $row['ingredients']) : array(),
                "isVegetarian" => (bool)$row['is_vegetarian'],
                "isGlutenFree" => (bool)$row['is_gluten_free']
            );
            array_push($pizzas, $pizza);
        }
        
        return $pizzas;
    }
    
    public function getCategories() {
        $query = "SELECT c.*, COUNT(p.id) as pizza_count 
                  FROM categories c 
                  LEFT JOIN pizzas p ON c.id = p.category_id AND p.is_active = TRUE
                  GROUP BY c.id 
                  ORDER BY c.name";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        $categories = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $category = array(
                "id" => strtolower($row['name']),
                "name" => $row['name'],
                "count" => (int)$row['pizza_count']
            );
            array_push($categories, $category);
        }
        
        // Add "All Pizzas" category
        $totalQuery = "SELECT COUNT(*) as total FROM pizzas WHERE is_active = TRUE";
        $totalStmt = $this->conn->prepare($totalQuery);
        $totalStmt->execute();
        $total = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        array_unshift($categories, array(
            "id" => "all",
            "name" => "All Pizzas",
            "count" => (int)$total
        ));
        
        return $categories;
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$api = new PizzaAPI();

switch($method) {
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'categories') {
            echo json_encode($api->getCategories());
        } else {
            echo json_encode($api->getPizzas());
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}
?>