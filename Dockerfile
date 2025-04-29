# ใช้ Node.js version 18 เป็นฐาน
FROM node:18

# ตั้ง working directory ภายใน container
WORKDIR /app

# ก๊อปเฉพาะไฟล์ package.json และ package-lock.json ก่อน (เพื่อ optimize การ build)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# ก๊อปไฟล์โปรเจกต์ทั้งหมด (source code) เข้า container
COPY . .

# เปิดพอร์ตที่ backend ใช้ เช่น 5000
EXPOSE 5000

# คำสั่งรันโปรเจกต์
CMD ["npm", "run", "start"]
