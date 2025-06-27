<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

class AuthAPI {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function register($data) {
        // Validate required fields
        if (empty($data['first_name']) || empty($data['last_name']) || 
            empty($data['email']) || empty($data['password'])) {
            return array("success" => false, "message" => "All fields are required");
        }
        
        // Check if email already exists
        $checkQuery = "SELECT id FROM users WHERE email = :email";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':email', $data['email']);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() > 0) {
            return array("success" => false, "message" => "Email already registered");
        }
        
        // Hash password
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Insert user
        $query = "INSERT INTO users (first_name, last_name, email, phone, password_hash) 
                  VALUES (:first_name, :last_name, :email, :phone, :password_hash)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':first_name', $data['first_name']);
        $stmt->bindParam(':last_name', $data['last_name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':password_hash', $passwordHash);
        
        if ($stmt->execute()) {
            $userId = $this->conn->lastInsertId();
            return array(
                "success" => true, 
                "message" => "User registered successfully",
                "user" => $this->getUserById($userId)
            );
        } else {
            return array("success" => false, "message" => "Registration failed");
        }
    }
    
    public function login($data) {
        if (empty($data['email']) || empty($data['password'])) {
            return array("success" => false, "message" => "Email and password are required");
        }
        
        $query = "SELECT * FROM users WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $data['email']);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($data['password'], $user['password_hash'])) {
                // Remove password hash from response
                unset($user['password_hash']);
                
                return array(
                    "success" => true,
                    "message" => "Login successful",
                    "user" => $user
                );
            } else {
                return array("success" => false, "message" => "Invalid password");
            }
        } else {
            return array("success" => false, "message" => "User not found");
        }
    }
    
    private function getUserById($id) {
        $query = "SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$api = new AuthAPI();

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    switch($action) {
        case 'register':
            echo json_encode($api->register($data));
            break;
        case 'login':
            echo json_encode($api->login($data));
            break;
        default:
            http_response_code(400);
            echo json_encode(array("message" => "Invalid action"));
            break;
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
}
?>