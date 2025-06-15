<div align="center">
  <h3 align="center">🌟 AI Tools</h3>
  <p align="center">
    🚀 <a href="#" target="_blank"><b>Live App</b></a> &nbsp;|&nbsp;
    📂 <a href="#" target="_blank"><b>Source Code</b></a>
  </p>
</div>

## 📚 <a name="table">Table of Contents</a>

1. 📋 [Introduction](#introduction)
2. 🛠️ [Tech Stack](#tech-stack)
3. 🚀 [Features](#features)
4. 🧩 [Diagram and Screenshots](#diagram-screenshots)
5. ⚙️ [Installation and Start Project](#installation-start-project)
   - [⭐ Prerequisites](#prerequisites)
   - [⭐ Cloning the Repository](#clone-repo)
   - [⭐ Packages Installation](#install-packages)
   - [⭐ Create a Cluster in MongoDB](#create-mongodb-cluster)
   - [⭐ Set Up Environment Variables](#set-up-env-variables)
   - [⭐ Running the Project](#running-project)
6. ☁️ [Deploy App in GKE](#deploy-app)
7. 🛠️ [Develop App in Kind Cluster Locally](#develop-app)
8. 👨‍💼 [About the Author](#about-the-author)

## <a name="introduction">📋 Introduction</a>

🛠️ **AI Tools** is a **Microservices** (full-stack) application

## <a name="tech-stack">🛠️ Tech Stack</a>

- **🖥️ Frontend Service**:

  - **React.js, JavaScript**,

- **📡 Node Backend Service**:

  - **Node.js, Express.js, JavaScript**,

- **📡 Go Backend Service**:

  - **Go, Gin**,

- **📡 Python Backend Service**:

  - **Python, Django**,

- **⚙️ Other Tools**:

  - Docker
  - Devbox
  - Kind Cluster
  - Helm (use it to install a Helm chart as app or tool in k8s cluster from Helm repository or OCI repository)
  - Oras (use it interact with OCI registry (such as Docker Hub) repos)

## <a name="features">🚀 Features</a>

**🔐 Authentication**: Secure sign-up and sign-in with email and password, handled by **xx**.

**🎨 Modern UI/UX**: Clean, intuitive interface designed for clarity and ease of use.

**📱 Responsive Design**: Seamlessly adapts to any screen size or device.

## <a name="diagram-screenshots">🧩 Diagram and 📸 Screenshots</a>

- **🧩 Database Tables Diagram**: [drawSQL Diagram Link](#)
- **📸 Screenshots**: [Miro Link](#)

  ![🖼️ Screenshots Preview](#)

## <a name="installation-start-project">📦 Installation and ⚙️ Start Project</a>

Follow these steps to set up the project locally on your machine.

### <a name="prerequisites">⭐ Prerequisites</a>

Make sure you have the following installed on your machine:

- Git
- Go
- Node.js and npm(Node Package Manager)
- Python3 and pip(Python Package Manager)

### <a name="clone-repo">⭐ Cloning the Repository</a>

```bash
git clone https://github.com/EvanHuang7/ai-tools.git
```

### <a name="install-packages">⭐ Packages Installation</a>

Install the services dependencies:

- Front and node-backend:

  ```bash
  cd frontend
  npm install
  cd ..
  cd ai-tools/node-backend
  npm install
  ```

- go-backend:

  ```bash
  cd ai-tools/go-backend
  go mod tidy
  ```

- python-backend:

  ```bash
  cd ai-tools/python-backend
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```

### <a name="create-mongodb-cluster">⭐ Create a Cluster in MongoDB</a>

Create a cluster by selecting a free plan and `Drivers` connection method under a project in MongoDB, and note down your cluster **connection string**—you'll need them later in the **Set Up Environment Variables step**. (Feel free to follow any MongoDB setup tutorial on YouTube to complete this step.)

⚠️ **Note**: Make sure your MongoDB proejct has public access

- Go to **SECURITY > Network Access** tab
- Click **ADD IP ADDRESS** button
- Click **ALLOW ACCESS FROM ANYWHERE** button
- Click **Confirm** button

### <a name="create-redis-in-upstash">⭐ Create a Redis DB in Upstash</a>

### <a name="create-postgre-db">⭐ Create a Local PostgreSql DB</a>

### <a name="set-up-env-variables">⭐ Set Up Environment Variables</a>

- Create a `.env` file under **node-backend** folder of your project and add the following content:

  ```env
  DATABASE_URL =
  ```

- Create a `.env` file under **go-backend** folder of your project and add the following content:

  ```env
  DATABASE_URL =
  ```

- Create a `.env` file under **python-backend** folder of your project and add the following content:

  ```env
  REDIS_URL =
  MONGODB_URL =
  ```

Replace the placeholder values with your actual credentials from MongoDB, ....

- 📌 Note:

### <a name="running-project">⭐ Running the Project</a>

Open **four separate terminal windows** and run the following commands to start the frontend and backends services:

**Terminal 1** – Start the Frontend Service (React Vite App):

```bash
cd ai-tools/frontend
npm run dev
```

**Terminal 2** – Start the Node-backend Service (Nodejs Express app):

```bash
cd ai-tools/node-backend
npm run dev
```

**Terminal 3** – Start the Go-backend Service (Go Gin app):

```bash
cd ai-tools/go-backend
air
```

**Terminal 4** – Start the Python-backend Service (Nodejs Express app):

```bash
cd ai-tools/python-backend
source venv/bin/activate
python manage.py runserver 8088
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser to view the project.

## <a name="deploy-app">☁️ Deploy App as K8s Cluster in GKE (GCP)</a>

Follow these steps to deploy app in GKE:

1. Go to GCP
2. Deploy app

## <a name="develop-app">🛠️ Develop App in Kind Cluster Locally</a>

Develop app in kind cluster locally is esay way to find out any issue in k8s during development process

You need Docker Desktop, devbox installed

1. Install devbox and run `devbox shell` cli to create isolated enviroment for project
2. Create a Kind cluster via Task command lines in `Taskfile.yaml` locally

- Generate Kind config file based on you file absolute path and create Kind cluster that is actually Docker containers in Docker Desktop VM locally

  ```
  task kind:01-generate-config
  task kind:02-create-cluster
  ```

- Check your kind cluster (This cli allows you to view and select existing created cluster)

  ```
  kubectx
  ```

- Check your nodes and system pods in kind cluster

  ```
  kubectl get nodes
  kubectl get pods -A
  ```

- Enable Load Balancer service in Local Kind Cluster by opening a 2nd terminal in proejct and running (Remember switch back to 1st terminal and leave 2nd terminal running in the background):

  ```
  devbox shell
  task kind:03-run-cloud-provider-kind
  ```

3. Open Docker Desktop app manually, then set up Docker buildx used to build container image for multiple architecture and Login Docker for pushing images to Docker hub by running:

```
task bootstrap-buildx-builder
docker login
```

4. Build container images of services and push to Docker hub

- go-backend serivce

```
task go-backend:build-container-image-multi-arch
```

- node-backend serivce

```
task node-backend:build-container-image-multi-arch
```

- python-backend serivce

```
task python-backend:build-container-image-multi-arch
```

- frontend serivce

```
task frontend:build-container-image-multi-arch
```

5. Deploy all services in Kind Cluster locally by using K8s resource definition that are using container images

- Make sure you are using Kind cluster by running:

  ```
  kubectx
  ```

- Create namespace

  ```
  task common:apply-namespace
  ```

- Deploy Traefik ingress controller in Local Kind cluster with Load Balancer serivce (Remember to only use it in local Kind Cluster intead of in GKE to aviod a Load Balancer to. Remember to uncomment this cli in file)

  ```
  task common:deploy-traefik-in-Kind
  ```

- Check all resources in traefik namespace (Note: the ExternalIP of LoadBalancer will stay `pending` forever if you don't run cli, `task kind:03-run-cloud-provider-kind`, to enable ExternalIP for Load Balancer in Local Kind Cluster in a seperate terminal)

  ```
  kubectl get all -n traefik
  ```

- Apply the Traefik middleware to strip path prefix for all incoming requests by ingress controller

  ```
  task common:apply-traefik-middleware
  ```

- Deploy go backend app in Local Kind cluster

  ```
  task go-k8s-resource-defins:apply
  ```

- Check pod and service in ai-tools namespace after deploying go backend app

  ```
  kubectl get pods -n ai-tools
  kubectl get svc
  ```

- Deploy

## <a name="about-the-author">👨‍💼 About the Author</a>

Hi! I'm Evan Huang — a full-stack software developer with 4+ years of experience in web applications, real-time systems, and cloud integration. I’m passionate about building scalable products with clean architecture, elegant UI/UX, and modern technologies like React, Node.js, MongoDB.

This chat app project was completed on **May 4, 2025**, and reflects my focus on full stack development, cloud infrastructure, and responsive design into real-world solutions.

Feel free to connect with me in LinkedIn or GitHub!

<a href="https://www.linkedin.com/in/evan-huang-97336b1a9/" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926619/Screenshot_2025-06-02_at_22.40.32_mxzsbh.png" alt="LinkedIn" width="150" />
</a>
<br/>
<a href="https://github.com/EvanHuang7" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926611/Screenshot_2025-06-02_at_22.52.45_jtlfww.png" alt="GitHub" width="150" />
</a>
