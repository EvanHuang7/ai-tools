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
6. ☁️ [Free: Deploy App in GCE VM (GCP)](#deploy-app-in-gce)
7. ☁️ [No-Free: Deploy App as K8s Cluster in GKE (GCP)](#deploy-app-in-gke)

8. ⚙️ [Run App in Kind Cluster Locally](#run-app-in-kind)
9. 🛠️ [Develop App Locally with Kind & Tilt](#develop-app-locally)
10. 👨‍💼 [About the Author](#about-the-author)

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

## <a name="deploy-app-in-gce">☁️ Free: Deploy App in GCE VM (GCP)</a>

📌 If your VM has enough CPU and Memory, it would be best to deploy this microservices project as K8s cluster using k3s or as docker containers using Docker swarm, so that we can taking advantanges of these k8s cluster orchestrator or container orchestrator. The pros to use orchestrator instead of Docker compose:

- Allow us to deploy new app version without downtime and easily roll back the version
- Allow us to run containers in differeent hosts/nodes/VMs for better scalabity
- Providee a way to handle sensative credentials or secrets

Follow these steps to deploy app using Docker-compose file in GCE:

1. Go to GCP Compute Engine page
2. Create a free `e2-micro` VM in GCE

- Click **Create instance** button in overview page
- Click **Enable Compute Engine API** button
- Go back to **Compute Engine > VM instances** and Click **Create instance** button after **Compute Engine API** is enabled

- Machine Config section

  - Enter your desired **Name** tag (eg. `appName-gce-free-vm`)
  - Select a **free VM region and zone** (eg. `us-central1` and `us-central1-a`)
  - Select `E2` for VM **Series** and `e2-micro` for **Machine type** below the **Machine Series** chart
  - Click **Advanced configurations** button
  - Make sure **vCPUs to core ratio and Visible core count** are selected to `None`
  - Then select `OS and storage` section in left side bar

- OS and storage section

  - Click **Change** button
  - Select `Debian` and `Debian 11 (bullseye)` for **OS and version**
  - Select `Standard persistent disk` for **disk type**
  - Keep `10 GB` for **Size** by default
  - Click **Select** button
  - Then select `Data protection` section in left side bar

- Data protection section

  - Select `No backups` for **Back up your data**
  - **Disable** all check boxs for **Continuously replicate data for disaster protection**
  - Then select `Networking` section in left side bar

- Networking section

  - Enable `Allow HTTP traffic` and `Allow HTTPS traffic`
  - Leave the rest of things as default

- Click **Create** button

3. Reserved a free static externalIP with same region of VM's region and attch it to VM

- Open a anther broswer tab and go to **VPC networks > IP addresses** in GCP
- Click **Reserve external static IP address** button
- Enter your desired **Name** tag (eg. `appName-static-external-ip`)
- Select `Standard` for **Network Service Tier**
- Select `IPv4` for **IP version**
- Select `Regional` for **Type**
- Select same region as the region of your VM (eg. `us-central1`) for **Region**
- Select your VM (eg. `appName-gce-free-vm`) for **Attached to**
- Click **Reserve** button

3. Install needed dependencies in VM

- Go back to **Compute Engine > VM instances** and the VM instancee we just created after VM is created
- Click **SSH** to connect VM
- Installs `Docker engine` by running

```
curl https://get.docker.com/ | sh
```

- Update user permission to access Docker

```
sudo chown $USER /var/run/docker.sock
```

- Check Docker access

```
docker ps
```

4. Run apps in containers with Docker-compose file (Use minimal VM CPU and memory)

- Create a folder

```
mkdir dockerComposeFolder
cd dockerComposeFolder
```

- Add `Docker-compose.yml` file to folder by copying the file content in local `Docker-compose.yml` file, run below command line and paste content and press `control + X`, `Y`, and `Enter` keys

```
nano Docker-compose.yml
```

- Run all app in containers with `Docker-compose.yml` by running

```
docker compose -f Docker-compose.yml up

OR

docker compose -f Docker-compose.yml up -d
```

- Now, You can access your app with your VM external IP address (eg. `http://35.209.142.39/`)

- Useful Docker clis to, turn down the containers, list running containers, list all containers (running + stopped), list Docker images on system, check details on a specific container

```
docker compose -f Docker-compose.yml down
docker ps
docker ps -a
docker images
docker inspect <container_id_or_name>
```

5. Run apps in containers with Docker Swarm (Use more VM CPU and memory than Docker-compose file beucase running Docker Swarm orchestrator use around 200MB memory)

- Turn off all containers first by running

```
docker compose -f Docker-compose.yml down
```

- Clean up existing all images and containers first to save VM resource

TODO: fix the unhealthy container issue in go backend by checking the health file path after using ko to build image
TODO: fix unhealthy pod issue in cluster by checking the

4. Deploy app

5. Set up DNS record in Cloudfalre to use your own domain

6. Make sure docker app and docker containers auto restart if VM shut down and restart

## <a name="deploy-app-with-docker-swarm-in-gce">☁️ Free: Deploy App with Docker Swarm in GCE VM (GCP)</a>

Do this aftere finish lasting section

## <a name="deploy-app-in-gke">☁️ No-Free: Deploy App as K8s Cluster in GKE (GCP)</a>

Follow these steps to deploy app in GKE:

1. Go to GCP
2. Create a free `e2-micro` VM in GCE
3. Create GKE cluster

-

3. Deploy app

## <a name="run-app-in-kind">⚙️ Run App in Kind Cluster Locally</a>

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
task go-backend:build-container-image-multi-arch-with-dockerfile
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

- Deploy Traefik ingress controller in Local Kind cluster with Load Balancer serivce

  - 📌 Note: It will provision a Load Balancer by Traefik default setting, so it will cause Load Balancer and ExternalIP fee if you run it in GKE of GCP.

  ```
  task common:deploy-traefik
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

- Deploy node backend app in Local Kind cluster

  ```
  task node-k8s-resource-defins:apply
  ```

- Check pod and service in ai-tools namespace after deploying node backend app

  ```
  kubectl get pods -n ai-tools
  kubectl get svc
  ```

- Deploy python backend app in Local Kind cluster

  ```
  task python-k8s-resource-defins:apply
  ```

- Check pod and service in ai-tools namespace after deploying python backend app

  ```
  kubectl get pods -n ai-tools
  kubectl get svc
  ```

- Deploy frontend app in Local Kind cluster

  ```
  task frontend-k8s-resource-defins:apply
  ```

- Check pod and service in ai-tools namespace after deploying frontend app

  ```
  kubectl get pods -n ai-tools
  kubectl get svc
  ```

- View the app locally with the `EXTERNAL-IP` (eg. `http://172.18.0.2/`) of Traefik LoadBalancer by running:

  ```
  kubectl get all -n traefik

  OR

  kubectl get svc -n traefik
  ```

- Useful kubectl clis for debug

  ```
  kubectl logs -n ai-tools <pod-name>
  kubectl describe pod -n ai-tools <pod-name>
  ```

## <a name="develop-app-locally">🛠️ Develop App Locally with Kind & Tilt</a>

Deploy apps by using Tilt to better detact file changes and auto rebuild and push imamges to enable these changes in local cluster envriomeent as quickly as possbile.

Use Tilt, we can develop against a k8s config that will match as close as possbile to what we are going to run in production, which will allow us to identify and debug issues that live not only at application layer but also at k8s layeer or maybe in ingress controller.

1. Make sure all apps are running in local kind cluster by finishing previous step, ⚙️ Deploy App in Kind Cluster Locally

2. Run Tilt and access Tilt page, `http://localhost:10350/`

```
task tilt-up
```

3. Set up Sync live update by following `https://docs.tilt.dev/tutorial/5-live-update.html` and `https://docs.tilt.dev/example_go.html` (set up instrcutions for different langauages)...........................................................

4. Work on your code, save files and the change will auto applied

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
