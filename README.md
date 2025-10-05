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
- Responsive UI with clean design  

### ⚙️ Backend (Spring Boot)
- RESTful APIs  
- JWT-based authentication  
- CRUD operations for users, products, and orders  
- PostgreSQL database integration  
- Layered architecture with DTOs and Services  

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Angular, TypeScript, HTML, SCSS |
| Backend | Spring Boot, Java, JPA |
| Database | PostgreSQL |
| API Communication | REST APIs |
| Build Tools | Maven, Angular CLI |
| Version Control | Git + GitHub |



---

## ⚡ Setup Instructions

### 🧠 1. Clone the Repository
```bash
git clone https://github.com/Prajwal07523/Cartify--Simple-Shopping-Cart.git
cd Cartify--Simple-Shopping-Cart
```


## 🔧 Backend Setup (Spring Boot)

1. **Navigate to backend folder:**
   ```bash
   cd Shopping-Cart
   ```
 
2.Create a Database name "cartify" in PostgreSQL

3.Update PostgreSQL credentials in
src/main/resources/application.properties
```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/cartify
spring.datasource.username=your_username
spring.datasource.password=your_password
```


4.Build and run the application:

5.Backend runs at:
👉 http://localhost:8081

## Frontend Setup (Angular)
1.Navigate to frontend folder:
```bash
 cd ../cartify-frontend
npm install
ng serve
```

2.Frontend runs at:
👉 http://localhost:4200

## 🧱Design Choices & Assumptions
- Used JWT Authentication for stateless security.
- Implemented a layered architecture (Controller → Service → Repository).
- Used DTOs for clean data transfer between layers.
- Used PostgreSQL for persistent and reliable storage.
- Cart and order management are user-specific.

## 📷 Optional Enhancements (Future Scope)
- Add payment gateway integration
- Admin dashboard for analytics
- Docker containerization for deployment
- CI/CD pipeline setup

