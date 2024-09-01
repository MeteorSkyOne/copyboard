# 第一阶段：构建前端代码
FROM node:16-alpine as build

LABEL maintainer="MeteorSky <meteorskymail@gmail.com>"

# 设置工作目录
WORKDIR /web

# 安装前端依赖并构建前端代码
COPY web/package*.json ./
RUN npm install --production
COPY web .
RUN npm run build

# 第二阶段：运行时环境
FROM node:16-alpine

LABEL maintainer="MeteorSky <meteorskymail@gmail.com>"

# 设置工作目录
WORKDIR /app

# 安装后端依赖
COPY server/package*.json ./
RUN npm install --production

# 复制前端构建结果到运行时镜像
COPY --from=build /web/dist ./dist
COPY server .

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]
