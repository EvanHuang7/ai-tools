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

## <a name="deploy-app-in-gce">☁️ Free: Deploy App with Docker Compose 🐳 in GCE VM (GCP)</a>

📌 If your VM has enough CPU and Memory, it would be best to deploy this microservices project as K8s cluster using k3s or as docker containers using Docker swarm, so that we can taking advantanges of these k8s cluster orchestrator or container orchestrator. The pros to use orchestrator instead of Docker compose:

- Allow us to deploy new app version without downtime and easily roll back the version
- Allow us to run containers in differeent hosts/nodes/VMs for better scalabity
- Providee a way to handle sensative credentials or secrets

Docker Compose deploys app as local containers without creating docker services.

Follow these steps to deploy app using docker-compose file in GCE:

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

4. Install required dependencies in VM

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

4. Deploy app by running app containers with docker-compose file (Use minimal VM CPU and memory)

- Create a folder

```
mkdir dockerComposeFolder
cd dockerComposeFolder
```

- Add `docker-compose.yml` file to folder by copying the file content in local `docker-compose.yml` file, run below command line and paste content and press `control + X`, `Y`, and `Enter` keys

```
nano docker-compose.yml
```

- Run all app in containers with `docker-compose.yml` by running (second cli would run containers in the background)

```
docker compose -f docker-compose.yml up

OR

docker compose -f docker-compose.yml up -d
```

- 🎉 Now, You can access your app with your VM external IP address (eg. `http://35.209.142.39/`)

  - ⚠️ Note: If you still can not access it with your VM external IP, you can try to access your app in 8080 port (eg. `http://35.209.142.39:8080`). If you still can not access it after the change, you can change the `ports` of `frontend` to be `- 80:8080` in `docker-compose.yml` file and redeploy the app containers to try again

- 📌 Useful Docker clis to, turn down the containers, list running containers, list all containers (running + stopped), list Docker images on system, check details on a specific container, check logs on a specific container

```
docker compose -f docker-compose.yml down
docker ps
docker ps -a
docker images
docker inspect <container_id_or_name>
docker logs <container_id_or_name>
```

TODO: Test it

5. 🚨 Important: We need to set up Docker engine and app containers would auto-restart if **VM reboots**

- Set the Docker daemon start automatically at VM reboots.

  - 1st cli is to turn on the existing systemd service file of `Docker`, so that `Docker` auto-restart when VM or system reboots. (systemd service file of `Docker` is created when installing `Docker`, but it is not enabled automatically.)
  - 2nd cli is to verify the `Docker` systemd service is active or not.

```
sudo systemctl enable docker
systemctl is-enabled docker
```

- Also, Making sure that we are using `restart: unless-stopped` for all app contaiers in `docker-compose.yml` file, which is what we already did. This resart policy set Docker to

  - Restart the container automatically if it crashes
  - Also restart it on VM reboot

- Test restart by simulating a VM reboot and check the container status after the VM boots

```
sudo reboot
docker ps
```

6. Set up a Domain

Get a free subdomain in **Duck DNS** and bind it to your VM static external IP address

🚨 Important: if you own a custom domain, you can easily bind your domain with VM static external IP address with a free SSL certificate by using `Cloudflare`, so that we don't need set up SSL certificate by your own and don't need to keep running `Nginx` (use defualt `80` port for `HTTP`, `443` port for `HTTPS`) in VM to serve your web app over HTTPS using that SSL certificate, which allow you to use `- 80:8080` as the `ports` of `frontend` in `docker-compose.yml` file because you don't need `Nginx` to proxy incoming request traffic to `frontend` container anymore.

- Go to Duck DNS page (`https://www.duckdns.org/`)
- Enter your desired **sub domain** name (eg. `appName-yourName`) in **domains** section
- Click **add domain** button
- Enter your VM static external IP address (eg. `35.209.142.39`) in **current ip** field
- Click **update ip** button
- Now, you can access the app with your subdomain (eg. `http://appName-yourName.duckdns.org/`)

7. Get a free SSL certificate for domain

- Connect to VM in GCP console
- Stop all running app containers

```
docker compose -f docker-compose.yml down
```

- Intall `Snap` and `nginx` packages

```
sudo apt update
sudo apt install snapd -y
sudo snap install core
sudo snap refresh core
sudo apt install nginx
```

- Install `Certbot` via `Snap`

```
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

- Run `Certbot` with `Nginx` to get a SSL certificate
  - ⚠️ Note: If running into port `80` is used issue, make sure you reserve port `80` for `nginx` by killing all existing processes listening to port `80`. Also, make sure the `ports` of `frontend` to be `- 8080:8080` in `docker-compose.yml` file
  - This cli would do
    - Certbot obtains and installs the SSL certificate via Let's Encrypt
    - It **configures your Nginx to use the certificate**
    - The cert is saved on disk (usually in /etc/letsencrypt/)

```
sudo certbot --nginx -d appName-yourName.duckdns.org
```

- Update `Nginx config` to proxy to `8080` port of `frontend` by running first command line to open `Nginx config` file frist. Then try to find the specific `server block` containing the existing script. After that, replace the `location /` block (inside this `server block` only) with updated script. Finally, save the updated config file.

```
sudo nano /etc/nginx/sites-available/default
```

Existing `Nginx config` server block

```
server {
    listen 443 ssl;
    listen [::]:443 ssl ipv6only=on;
    server_name aitools-evanhuang.duckdns.org;

    ssl_certificate /etc/letsencrypt/live/aitools-evanhuang.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aitools-evanhuang.duckdns.org/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Updated script for locaton / block

```
location / {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

- Reload Nginx again after updating and saving `config` file.

```
sudo nginx -t
sudo systemctl reload nginx
```

⚠️ Note: If you run into this error, `nginx.service is not active, cannot reload`

- you can start `nginx` and check status. If the status is `Active: active (running)`, you are good to skip the rest of warning steps

```
sudo systemctl start nginx
sudo systemctl status nginx
```

- If you run into a new error like `Job for nginx.service failed because the control process exited with error code` when startting `nginx`, that means there are other running processes listening to ports `80 or 443`.

- Try to find out those running processes first by running

  ```
  sudo apt install lsof
  sudo lsof -i :80 -sTCP:LISTEN
  sudo lsof -i :443 -sTCP:LISTEN
  ```

- If all those process are `Nginx`, just go to next step. Else (they are not `Nginx`), running `sudo kill -9 <PID>` cli to kill them manually
- After all running process of ports `80 or 443` is only `Nginx`, we can running `sudo systemctl status nginx` cli to check `Nginx status`. If it is `Active: failed` status, try to kill all Nginx processes, restart it and check status again by running clis below. The status should be `Active: active (running)` now.

  ```
  sudo pkill nginx
  sudo systemctl start nginx
  sudo systemctl status nginx
  ```

- Test if SSL certificate auto-renew is handled or not

```
sudo certbot renew --dry-run
```

- Restart all app containers again

```
docker compose -f docker-compose.yml up -d
```

- Now, Your domain has a free SSL certificate, and you can access your app via `https` (eg. `https://appName-yourName.duckdns.org`)

TODO: Test it

- 🚨 Important: We need to set up `Nginx` in VM will auto-restart if **VM or system reboots**
  - 1st cli is to turn on the existing systemd service file of `Nginx`, so that `Nginx` auto-restart when VM or system reboots. (systemd service file of `Nginx` is created when installing `Nginx`, but it is not enabled automatically.)
  - 2nd cli is to verify the `Nginx` systemd service is active or not.

```
sudo systemctl enable nginx
systemctl is-enabled nginx
```

- Test restart by simulating a VM reboot and check `Nginx` and `Docker containers` status after the VM boots

```
sudo reboot
sudo systemctl status nginx
docker ps
```

TODO: fix unhealthy pod issue in cluster by checking the all Deployment.ymal files

## <a name="deploy-app-with-docker-swarm-in-gce">☁️ Free: Deploy App with 🐳🐳 Docker Swarm 🐳🐳 in GCE VM (GCP)</a>

Deploy app as Docker services that manage tasks (containers) via Docker Swarm (Use more VM CPU and memory than docker-compose file beucase running Docker Swarm orchestrator use around 200MB memory)

🚨🚨 Important: make sure you finish previous `Deploy App with Docker Compose in GCE VM (GCP)` step first.

1. Deploy app with Docker Swarm

- Connect to VM in GCP console
- Turn off all running containers first by running

```
docker compose -f docker-compose.yml down
```

- Clean up existing all images and containers first to save VM resource

```
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -q)
```

- Check Disk Usage of Docker

```
docker system df
```

- Enable Docker Swarm mode in Docker

```
docker swarm init
```

- Create a folder

```
mkdir dockerSwarmFolder
cd dockerSwarmFolder
```

- Add `docker-swarm.yml` file to folder by copying the file content in local `docker-swarm.yml` file, run below command line and paste content and press `control + X`, `Y`, and `Enter` keys

```
nano docker-swarm.yml
```

- Create docker secrets for Docker swarm services to consume first (Remember to replace your url string to real a url string)

```
printf 'your url' | docker secret create supabase-postgres-database-url -

printf 'your url' | docker secret create neon-postgres-database-url -

printf 'your url' | docker secret create redis-url -

printf 'your url' | docker secret create mongodb-url -
```

- Deploy stack of app containers with docker-swarm file

```
docker stack deploy -c docker-swarm.yml ai-tools
```

- List all Docker services status and view the nodes in the swarm
  - `Docker service` is top-level Swarm object that manages desired state (e.g. `replicas: 3`, which image to use), scaling, and containers used by **Docker Swarm**. You don't run containers directly. You define services, and Swarm runs containers to satisfy the service.
  - In **Docker Compose**, `Docker service` isn't a first-class object because Docker Compose spins up containers directly without creating services.
  - You still can use `docker ps` cli to view Docker container status in **Docker Swarm**

```
docker service ls
docker node ls
```

2. App latency issue and solution after deploying app with Swarm

⚠️ Warning: If your GCE VM is free `e2-micro` type, your app may becomes **much slower** including accessing the web page and internal api calls after deploying via Docker Swarm, comparing to running the same containers with docker-compose.

These are some reasones of extra latency introduced by Swarm architecture default by **comparing Docker Swarm and Docker Compose**:

- **Docker Swarm** is desgined to used across **mutiple VMs**. Swarm would use the across VMs mechanism to handle the requst traffic between services even if we are running it in 1 VM.

  - The **Swarm Load Balancer** is automatically created when you deploy services in Docker Swarm mode. It's a built-in mechanism that uses `VIP(Virtual IP)-based load balancing` to route traffic between containers, even across nodes.
  - Docker Swarm Creates a `virtual IP (VIP)` for every service. Swarm Load Balancer would use `VIP` and `Routing mesh` for internal routing
  - Docker Swarm uses the `overlay network (VXLAN)` for multi-node setups, which adds packets or **network encapsulation** (`wrapped, routed, and unwrapped steps for a requst`). This encapsulation step still happens even if it is service commnunication within same VM.
  - Above mechanism causes higher latency, more CPU and network stack usage, slower service-to-service communication even though everything is running on the 1 VM.
  - Swarm is `cluster-first`, so it **doesn’t skip** the `routing mesh or VXLAN` just because there’s only one node — it assumes more nodes could join at any time.

- **Docker Compose** is desgined to used in **1 VM**.
  - Docker Compose uses the `bridge network`, allow a container talk to other containers **without encapsulation** (`wrapped, routed, and unwrapped steps for a requst`) or virtual IP translation
  - Simple local networking on the same VM.
  - Fastest path: direct, local TCP/IP traffic.
  - Above mechanism causes Low latency and minimal CPU/network overhead

You can do the following change to fix or improve:

- 1st Recommanded: Switch back to use Docker Compose to deploy app if you are ok with

  - Deploy new app version with a few seconds of app downtime
  - Unable to scale up VM/node number for Swarm in future
  - Handle sensative credentials or secrets by your own

- 2nd Recommanded: Stop using Nginx in VM

  - Stop running `Nginx` that was serving SSL and acting as a reverse proxy (proxy routing incoming traffic to frontend) in VM. Also, make sure disable the `Nginx` entirely on VM reboot.
  - Update `frontend` service in `docker-swarm` file to directly publish on port 80 inside the swarm.
  - Redeploy app in Docker Swarm again.
  - Now you can only access page with `http`, but the app latency issue would be fixed.
  - You make your app to be accessed with `https` by buying a domain from some domain provider (eg. `Namecheap`, `GoDaddy`, `Squarespace`) first, then easily creating a DNS record and setting up `SSL/TLS` to use `Flexiable encription mode` in CloudFlare.

- Paid to upgrate your free VM to a higher machine type for getting more CPU and RAM

TODO: Test it

4. 🚨 Important: Make sure Docker Swarm, the Docker Swarm Services running apps inside Docker Swarm and Docker Swarm secrets auto-restart after **VM reboots**.

- Set auto-restart for Docker Swarm and Docker Swarm Services running apps inside Docker Swarm.

  - If you **DIDN'T** set the Docker daemon start automatically at VM reboot in previous **Deploy App with Docker Compose in GCE VM** section, just set it here by running
    ```
    sudo systemctl enable docker
    systemctl is-enabled docker
    ```
  - The Docker Swarm and the Docker Swarm Services running apps will auto-restart too after VM reboots because
    - Swarm stores service definitions and desired state in the `Raft store` under `/var/lib/docker/swarm/` on disk.
    - When Docker Engine restarts, Swarm reboots as well, and any services not currently running will be re-deployed automatically by the Swarm manager with Swarm Services.

- Docker Swarm secrets persist even if the **Swarm manager node restarts or the VM reboots** because Swarm stores secrets in the `Raft log` that is Persisted on disk in `/var/lib/docker/swarm/`.
  - But, the secrets used by Swarm Services would be deleted if there is only **1** manager node and **that gets destroyed**.
  - So, We need to recreate the secrets if we want to start swarm mode again after leaving swarm mode by running `docker swarm leave --force` cli that would delete all stored secrets.

TODO: move to Docker compose section?

5. App network routing explanation in 1 node Docker Swarm

6. The network routing between app users internet and frontend app

The case of running Nginx in VM:

- Default behaviour of running `Nginx` after installation.
  - When you installed and run `Nginx` in VM, it does bind to `0.0.0.0` by default, which means it listens on all network interfaces — public and private IPs of your VM.
  - When running `Nginx`, it uses default `port 80 (HTTP)` and default `443 (HTTPS)` of VM by default.
  - We configed our VM to get a SSL certicate in `Nginx`.
  - Running Nginx in VM serves a SSL certicate, which allows user to access VM by `https`.
  - So, when all app users access VM by entering VM's public external IP with `http port 80` (eg. `http://172.18.0.2`) or `https port 443` (eg. `https://172.18.0.2`) by default.
  - The app users would access the `Nginx` app.
- The step to use `Nginx` in VM as a proxy to forward all incoming requests of VM

  - We configed the `Nginx config` file in VM with `proxy_pass http://localhost:8080`.

  TODO: 🚨 Test it, because looks like we only config the forwarding for `https 443 port` no `http 80 port` unless HTTP is automatically redirected to HTTPS by `Nginx` by default

  - This config would let `Nginx` forward all of its incoming traffic (default `http 80 port` and `https 443 port`) to `http://localhost:8080` of VM.

- The step of accessing `frontend` app
  - 1st step of exposing `frontend` app from internal container to external of container or allowing VM to access `frontend` app in container:
    - We set `server { listen 8080; ...}` in the `nginx.conf` file. `Nginx` will bind host to all interfaces `(0.0.0.0)` by default if we don't sepcify a host explicitly.
    - `nginx.conf` file is used as config file for the base image,`nginxinc/nginx-unprivileged:1.23-alpine-perl`, of `frontend` container image.
    - So, `frontend` app is running on port `8080` of container and listens on `0.0.0.0:8080`.
    - As a result, VM has access to `frontend` app inside container on this `8080` port.
  - 2nd step of VM accesses the running `frontend` app inside container
    - We set the `ports` of `frontend` service to be `8080:8080` in `docker-compose.yml` and `docker-swarm.yml` files.
    - Docker publishes port with `8080:8080`, so that Docker maps VM’s `port 8080` to `frontend` service container’s port `8080`.
    - As a result, Docker handles **forwarding** traffic from VM’s port 8080 → `frontend` service container’s port 8080.
  - 3rd step of users access `frontend` app
    - In internet, all app users access VM by entering VM's public external IP with `http port 80` or with `https port 443` by default (eg. `http://172.18.0.2` or `https://172.18.0.2`).
    - The app users would access the `Nginx` app first, and `Nginx` app would forward it's incoming traffic to `http://localhost:8080` of VM.
    - The incoming traffic of `http://localhost:8080` of VM would be forwarded by Docker to `frontend` service container’s port `8080`.
    - The `frontend` service container’s port `8080` is running `frontend` app, so user can acceess the running `frontend` app now.
    - Requirment: The firwall of VPC network that VM lives in allows inbound traffic on http port 80 and hppts port 443
    - Requirment: No other service conflicts on port 80 or port 443 on the VM

The case of NO Nginx in VM:

- We defined `frontend` as a service in `docker-compose.yml` and `docker-swarm.yml` files

  - The step of exposing `frontend` app from internal container to external of container or allowing VM to access `frontend` app in container:
    - We set `server { listen 8080; ...}` in the `nginx.conf` file. `Nginx` will bind host to all interfaces `(0.0.0.0)` by default if we don't sepcify a host explicitly.
    - `nginx.conf` file is used as config file for the base image,`nginxinc/nginx-unprivileged:1.23-alpine-perl`, of `frontend` container image.
    - So, `frontend` app is running on port `8080` of container and listens on `0.0.0.0:8080`.
    - As a result, VM has access to `frontend` app inside container.
  - The step of VM accesses the running `frontend` app inside container
    - We set the `ports` of `frontend` service to be `80:8080` in `docker-compose.yml` and `docker-swarm.yml` files.
    - Docker publishes port with `80:8080`, so that Docker maps VM’s `default http port 80` to `frontend` service container’s port `8080`.
    - As a result, Docker handles **forwarding** traffic from VM’s default port 80 → `frontend` service container’s port 8080.
  - The step of users access `frontend` app

    - In internet, all app users access VM by entering VM's public external IP with `http port 80` by default (eg. `http://172.18.0.2`).
    - The app user's request to VM's port 80 will be forwarded by Docker to `frontend` service container’s port `8080`.
    - The `frontend` service container’s port `8080` is running `frontend` app, so user can acceess the running `frontend` app now.
    - Requirment: The firwall of VPC network that VM lives in allows inbound traffic on http port 80
    - Requirment: No other service conflicts on port 80 on the VM

52. The network routing between frontend app and backend apps

- We set `proxy_pass` in the `nginx.conf` file. `Nginx` forward frontend app's traffic to the destination we specify
  - set `proxy_pass http://go-backend:8000/`, to forward all `/api/go/` api calls to the `8000` port of `go-backend`.
  - `go-backend` is **Docker service name**, and containers can communicate using the service name as the hostname in **Docker Compose** and **Docker Swarm** (Swarm extends this across multiple nodes).
  - **Docker DNS** resolves Docker service name to the container's internal IP on the shared network.
  - The api call request is sent over Docker’s virtual network from `frontend` service container to `go-backend` service container.
  - `go-backend` app running inside `go-backend` service container is listening on `0.0.0.0:8000`, so it accepts the request.
  - Note: if `go-backend` app is not set to listen on all network interfaces, `0.0.0.0`, app will reject the request.
  - Note: We should use `http://docker service name:port/` instead of `http://localhost:8000/` because frontend app is running on different containers from all other backend apps.
  - Same logic for `proxy_pass http://node-backend:3000/`
  - Same logic for `proxy_pass http://python-backend:8088/`

## <a name="deploy-app-in-gke">☁️ No-Free: Deploy App as K8s Cluster in GKE (GCP)</a>

Follow these steps to deploy app in GKE:

1. Switch to proejct isolated environment first

```
devbox shell
```

2. Create a GKC cluster

- Authenticate and configure the gcloud CLI
  - Select `Re-initialize the configuration` for **Pick up configuration to use** or `Create a new configuration` if you have not initailize before
  - Loggin into your google account
  - Pick up a google cloud project you want to use
  - Configure a default Compute Region and zone by selecting `us-central1-a`. (Note: if you select a different region and zone, you should update them in local `Taskfile.yaml` file too)

```
task gcp:01-init-cli
```

- Enable all required GCP APIs

```
task gcp:02-enable-apis
```

- Create a custom VPC instead of using the default VPC of the project

```
task gcp:04-create-vpc
```

- Create a subnet for `us-central1-a` region under VPC

```
task gcp:05-create-subnet
```

- Update `GCP_PROJECT_ID` in local `Taskfile.yaml` file to be the google cloud project id you selected when setting up gcloud CLI authentication.

- Create a **Standard** GKE cluster with `e2-standard-2` machine type and 2 worker nodes (VMs).

```
task gcp:06-create-cluster
```

🚨 Important: You may encounter `CRITICAL: ACTION REQUIRED: gke-gcloud-auth-plugin, which is needed for continued use of kubectl, was not found or is not executable. Install gke-gcloud-auth-plugin for use with kubectl by following https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin` error beacause The `Google Cloud SDK` installed in Devbox (via devbox.json packages) does not include the `gke-gcloud-auth-plugin` binary by default. It's a minimal version. Fixed the issue to allow you interact with your GKE cluster in **host** instead in **project devbox** by

- Follow `https://cloud.google.com/sdk/docs/install` to install **google cloud sdk** into your **host** instead of project devbox
- Install `gke-gcloud-auth-plugin` in your host by running

```
gcloud components install gke-gcloud-auth-plugin
```

- Verify the `gke-gcloud-auth-plugin` is installed and make sure your `kubectl` config uses this plugin

```
which gke-gcloud-auth-plugin
kubectl config view --raw
```

- Now, You can use `kubectl` on your **host** machine to interact with the GKE cluster you just created. Such as, view the cluster's worker nodes

```
kubectl get nodes
```

3. Deploy app

## <a name="set-up-different-app-environment">Set up different app environment (Demo and Prod)</a>

## <a name="set-up-ci-cd">Set up CI & CD for GKE Cluster</a>

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
