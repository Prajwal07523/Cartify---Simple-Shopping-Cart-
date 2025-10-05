# 🛒 Cartify — Simple Shopping Cart

Cartify is a full-stack shopping cart application built with **Spring Boot (Backend)** and **Angular (Frontend)**.  
It provides an end-to-end shopping experience with authentication, product management, cart operations, and order tracking.

---

## 🚀 Features

### 🧩 Frontend (Angular)
- User registration and login  
- Product listing and details  
- Add/remove items from cart  
- Order placement and checkout  
- Profile management  
- Responsive UI with clean design  

### ⚙️ Backend (Spring Boot)
- RESTful APIs  
- JWT-based authentication  
- CRUD operations for users, products, and orders  
- PostgreSQL database integration  
- Layered architecture with DTOs and Services  
- Exception handling and validation  

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Angular, TypeScript, HTML, SCSS |
| Backend | Spring Boot, Java, JPA/Hibernate |
| Database | PostgreSQL |
| API Communication | REST APIs |
| Build Tools | Maven, Angular CLI |
| Version Control | Git + GitHub |

---

## 🏗️ Project Structure
Cartify--Simple-Shopping-Cart/
│
├── Shopping-Cart/ # 🧠 Backend (Spring Boot)
│ ├── src/
│ ├── pom.xml
│ └── ...
│
├── cartify-frontend/ # 💻 Frontend (Angular)
│ ├── src/
│ ├── package.json
│ └── ...
│
└── README.md


---

## ⚡ Setup Instructions

### 🧠 1. Clone the Repository
```bash
git clone https://github.com/Prajwal07523/Cartify--Simple-Shopping-Cart.git
cd Cartify--Simple-Shopping-Cart



## 🔧 Backend Setup (Spring Boot)

1. **Navigate to backend folder:**
   cd Shopping-Cart
 

2.Update PostgreSQL credentials in
src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cartifydb
spring.datasource.username=your_username
spring.datasource.password=your_password


3.Build and run the application:
4.Backend runs at:
👉 http://localhost:8081

## Frontend Setup (Angular)
1.Navigate to frontend folder:

 cd ../cartify-frontend
npm install
ng serve

2.Frontend runs at:
👉 http://localhost:4200



