# ใช้ Node.js official image
FROM node:18-alpine

# สร้างโฟลเดอร์งานใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json ไปยัง container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดของโปรเจกต์ไปยัง container
COPY . .

# เปิดพอร์ตที่แอปใช้งาน (เช่น 3000)
EXPOSE 3000

# รันแอปโดยใช้คำสั่ง start ใน package.json
CMD ["npm", "start"]
