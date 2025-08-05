<div align="center">
  <h3 align="center">🌟 AI Tools Studio</h3>
  <p align="center">
    🚀 <a href="https://aitools-evanhuang.duckdns.org/" target="_blank"><b>Live App</b></a> &nbsp;|&nbsp;
    📂 <a href="https://github.com/EvanHuang7/ai-tools" target="_blank"><b>Source Code</b></a>
  </p>
</div>

## 📚 <a name="table">Table of Contents</a>

1. 📋 [Introduction](#introduction)
2. 🛠️ [Tech Stack](#tech-stack)
3. 🚀 [Features](#features)
4. 🧩 [Diagram and Screenshots](#diagram-screenshots)
5. ⚙️ [Installation & Setups for Project](#installation-setups-project)
   - ⭐ [Prerequisites](#prerequisites)
   - ⭐ [Clone the Repository](#clone-repo)
   - ⭐ [Set up gcloud CLI](#set-up-gcloud-cli)
   - ⭐ [Packages Installation](#install-packages)
   - ⭐ [Create a Cluster and DB in MongoDB](#create-mongodb-cluster)
   - ⭐ [Create a PostgreSql DB in Supabase](#create-postgre-db-in-supabase)
   - ⭐ [Create a PostgreSql DB in Neon](#create-postgre-db-in-neon)
   - ⭐ [Create a Redis DB in Upstash](#create-redis-in-upstash)
   - ⭐ [Set up GCP Pub/Sub & Google Cloud Storage](#set-up-gcp-pubsub-and-gcs)
   - ⭐ [Get Google Gemini API Key](#get-google-gemini-api-key)
   - ⭐ [Set up GCP services authorization for app](#set-up-gcp-services-authorization)
   - ⭐ [Set up Imagekit.io](#set-up-imagekit)
   - ⭐ [Set up VAPI](#set-up-vapi)
   - ⭐ [Set up Clerk & Clerk Billing](#set-up-clerk)
   - ⭐ [Set up RabbitMQ in CloudAMQP](#set-up-rabbitmq)
   - ⭐ [Set up Kafka in Redpanda Cloud (DEPRECATED)](#set-up-kafka)
   - ⭐ [Set Up Environment Variables](#set-up-env-variables)
   - ⭐ [Running the Project](#running-project)
6. ☁️🐳 [GCE(GCP) VM: Deploy App with Docker Compose 🐳](#deploy-app-in-gce-with-docker-compose)
   - ⭐ [Set up GCE VM](#set-up-gce-vm)
   - ⭐ [Deploy app in GCE VM](#deploy-app-gce-vm)
   - ⭐ [Set up Domain & HTTPS](#set-up-domain-and-https)
7. ☁️🐳🐳 [GCE(GCP) VM: Deploy App with 🐳🐳 Docker Swarm 🐳🐳](#deploy-app-in-gce-with-docker-swarm)
   - ⭐ [Deploy app in GCE VM with Docker Swarm](#deploy-app-gce-vm-with-docker-swarm)
   - ⭐ [Potential App Latency Issue in Swarm](#potential-app-latency-issue-in-swarm)
   - ⭐ [Set up Auto-restart when VM Reboots](#set-up-auto-restart)
   - ⭐ [Network Routing Explanation in GCE VM](#network-routing-explanation-in-gce-vm)
8. ☁️☸️ [GKE (GCP): Deploy App in K8s Cluster](#deploy-app-in-gke)
   - ⭐ [Create VPC, Subnet and K8s Cluster](#create-vpc-subnet-k8s-cluster)
   - ⭐ [Set up K8s Cluster](#set-up-k8s-cluster)
   - ⭐ [Deploy Apps in K8s Cluster](#deploy-apps-in-k8s-cluster)
9. 🏗️☸️ [GKE (GCP): Deploy app on 🛠️Staging and 🚀Prod Environments](#deploy-app-on-staging-and-pro)
   - ⭐ [Deploy App on Staging Environment](#deploy-app-on-staging-env)
   - ⭐ [Error & Solution after App Deployment](#error-solution-after-app-deployment)
   - ⭐ [Set up GCP Authorization, Domain and HTTPS for Staging Env](#set-up-gcp-authorization-domain-https-for-staging-env)
   - ⭐ [Deploy App on Production Environment](#deploy-app-on-production-env)
10. 🔁☸️ [GKE (GCP): Deploy App with CI&CD in K8s Cluster](#deploy-app-with-ci-cd-in-cluster)
   - ⭐ [Set up Continuous Integrataion (CI)](#set-up-ci)
   - ⭐ [Deploy App with GitOps in Staging Cluster](#deploy-app-with-gitops-in-staging)
   - ⭐ [Error & Solution after App Deployment with GitOps in Staging Cluster](#error-solution-after-app-deployment-with-gitops)
   - ⭐ [Set up GCP Authorization, Domain and HTTPS for Staging Cluster with GitOps](#set-up-gcp-authorization-domain-https-for-staging-env-gitOps)
   - ⭐ [Deploy App with GitOps in Production Cluster](#deploy-app-with-gitops-in-production)
11. 🔁🐳 [GCE(GCP) VM: Set up CI&CD for App Deployment in Docker](#set-up-ci-cd-in-docker)
12. ⚙️ [Run App in Kind Cluster Locally](#run-app-in-kind)
   - ⭐ [Build App Container Images & Upload them to Docker Hub](#build-app-container-image-and-pus)
   - ⭐ [Deploy App in Kind Cluster](#deploy-app-in-kind-cluster)
13. 🛠️ [Develop App Locally with Kind & Tilt](#develop-app-locally-kind-tilt)
14. 👨‍💼 [About the Author](#about-the-author)

## <a name="introduction">📋 Introduction</a>

**🛠️ AI Tools Studio** is a **full-stack microservices application** seamlessly integrated with **☁️ Google Cloud Platform (GCP)**. It empowers users to **create stunning content in seconds** using a suite of AI-powered tools, including **🎨 Image Editing, 🖼️ AI Image Generation, 🎬 Video Generation and 💬 Intelligent Conversations**.

## <a name="tech-stack">🛠️ Tech Stack</a>

- **🖥️ Frontend Service**:
  - **React.js, TypeScript**,
  - **Clerk and Clerk Billing** for Authentication and Payment
  - **Tanstack React Query** for API management
  - **Shadcn & Tailwind CSS** for UI

- **📡 Node Backend Service**:
  - **Node.js, Express.js, JavaScript**,
  - **Supabase PostgreSql DB, Drizzle ORM**

- **📡 Go Backend Service**:
  - **Go, Gin**,
  - **Neon PostgreSql DB, GORM**

- **📡 Python Backend Service**:
  - **Python, Flask**,
  - **MongoDB, Upstash Redis, MongoEngine**

- **☁️ Google Cloud Platform (GCP)**
  - **Google Kubernetes Engine (GKE)** for deploying app in K8S cluster case
  - **Google Compute Engine (GCE)** for deploying app in VM with **Docker Compose or Docker Swarm** cases
  - **Google Cloud Storage (GCS)** for file storage
  - **GCP Cloud Pub/Sub** (Go -> Node.js)
  - **GCP IAM** for authorization to GCP services used by app
  - **GCP Secret Manager** for sensative Secrets Management

- **🤖 AI & Other Tools and Techs**:
  - **Vapi AI** for voice assistant
  - **Google Gemini AI Veo2** for video generation
  - **Imagekit.io AI** for image generation and editing
  - **gRPC** (Python -> GO)
  - **RabbitMQ of CloudAMQP** (Node.js -> Python)
  - **Kafka of RedPanda Cloud** (Node.js -> Python)
  - **Docker & Docker Hub** for building and storing container images
  - **GitHub Actions Workflow** for **Continuous Integration (CI)**
  - ☸️ GKE K8S cluster case:
    - **KluCtl GitOps** for **Continuous Deployment (CD)**
    - **Cloudflare** for DNS hosting and SSL/TLS encryption
    - **Traefik** for load balancer and incoming traffic distribution
  - 🐳 GCE VM with Docker Compose or Docker Swarm cases:
    - **WatchTower** for **Continuous Deployment (CD)**
    - **DuckDNS** for DNS hosting
    - **Certbox** for SSL/TLS encryption
    - **Nginx** for incoming traffic distribution

## <a name="features">🚀 Features</a>

**🔐 Authentication** – Secure sign-up and sign-in with a Google account or with email and password, powered by **Clerk**. 

**🎨 Image Editing** – Effortlessly remove backgrounds, enhance image quality, and apply stunning AI-powered transformations using **ImageKit.io AI**.  

**🖼️ Image Generation** – Create unique, high-quality visuals from text prompts with **ImageKit.io AI**.  

**🎬 Video Generation** – Transform your ideas into dynamic video content using **Google Gemini AI Veo2**.  

**💬 AI Voice Chat** – Have natural, real-time voice conversations with AI via **Vapi AI**.  

**📂 History Records Download** – View and download all stored images, videos, and chat histories from databases including **MongoDB**, **Supabase**, and **Neon**.  

**📊 App Usage Monitoring** – Track monthly usage of all app features directly from the dashboard. Data is aggregated from all backend services — **image editing (Python)**, **image & video generation (Go)**, and **AI voice chat (Node.js)** — via **gRPC**, **GCP Cloud Pub/Sub**, and **RabbitMQ**.  

**💳 Payment & Subscriptions** – Subscribe to different plans and complete payments seamlessly via **Clerk Billing**.  

**✨ Modern UI/UX** – A clean, intuitive interface designed for clarity and ease of use.  

**📱 Responsive Design** – Optimized for any screen size or device for a consistent experience everywhere.

## <a name="diagram-screenshots">🧩 Diagrams and 📸 Screenshots</a>

- **☸️ Architecture Diagram for GKE K8S cluster case**: [Lucidchart Diagram Link](https://lucid.app/lucidchart/56444643-849b-4db6-8393-2f806552c943/edit?viewport_loc=-1753%2C-523%2C4235%2C2044%2C0_0&invitationId=inv_511bf5d6-c44a-4abf-bcfb-c04c923ab683)
- **🐳 Architecture Diagram for GCE VM with Docker Swarm case**: [Lucidchart Diagram Link](https://lucid.app/lucidchart/efc15287-24d3-4033-96e3-6fa14c29b91e/edit?viewport_loc=-2379%2C-774%2C5425%2C2618%2C0_0&invitationId=inv_15990ffa-2a86-4063-9d67-055a522f95dc)
- **🧩 Database Tables Diagram**: [drawSQL Diagram Link](https://drawsql.app/teams/evans-projects/diagrams/ai-tools-studio-app)

TODO: Come back to finish "Screenshots" part 

- **📸 Screenshots**: [Miro Link](#)

  ![🖼️ Architecture Diagram Screenshot Preview, GKE K8S cluster case](https://storage.googleapis.com/ai-tools-gcs-bucket/App%20README%20Diagram%20Screenshots/GKE-K8S-cluster.png)
  ![🖼️ Architecture Diagram Screenshot Preview, GCE VM with Docker Swarm case](https://storage.googleapis.com/ai-tools-gcs-bucket/App%20README%20Diagram%20Screenshots/GCE-VM-with%20Docker-Swarm.png)
  ![🖼️ Screenshots Preview](#)

## <a name="installation-setups-project">⚙️ Installation & Setups for Project</a>

Follow these steps to **set up** the project locally on your machine.

### <a name="prerequisites">⭐ Prerequisites</a>

Make sure you have the following installed on your machine:

- Git
- Go
- Node.js and npm(Node Package Manager)
- Python3 and pip(Python Package Manager)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) for `gcloud CLI` - Required for App Deployment in GKE K8S cluster
- [Devbox](https://www.jetify.com/docs/devbox/installing_devbox/)
- [Docker Desktop](https://docs.docker.com/get-started/get-docker/) - Required for App Development

### <a name="clone-repo">⭐ Clone the Repository</a>

```bash
git clone https://github.com/EvanHuang7/ai-tools.git
```

### <a name="set-up-gcloud-cli">⭐ Set up gcloud CLI (Required for App Deployment in GKE K8S cluster)</a>

You have **2 options** to make **gcloud CLI** work for this project. **1st option** is to install `google-cloud-sdk` and `gke-gcloud-auth-plugin` in the home directory of your host or machine. **2nd option** is to update the `devbox.json` file in project folder.

**🚨 Important Error**:

> **IF YOU DIDN'T FINISH** any of the options, you will encounter `CRITICAL: ACTION REQUIRED: gke-gcloud-auth-plugin, which is needed for continued use of kubectl, was not found or is not executable. Install gke-gcloud-auth-plugin for use with kubectl by following https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin` error when you use **gcloud CLI** to interact with GKE cluster in latter **☁️ GKE (GCP): Deploy App in K8s Cluster** section.

**💡 Reason of Error**:

> The `google-cloud-sdk@latest` installed in Devbox (via `devbox.json` packages) does not include the `gke-gcloud-auth-plugin` binary by default. It's a minimal version.

**1st Option (👍 Recommended)**:

- Follow `https://cloud.google.com/sdk/docs/install` to install **Google Cloud SDK** in your **host**.
- Install `gke-gcloud-auth-plugin` in your host by running

  ```bash
  gcloud components install gke-gcloud-auth-plugin
  ```

- Verify the `gke-gcloud-auth-plugin` is installed and make sure your `kubectl` config uses this plugin

  ```bash
  which gke-gcloud-auth-plugin

  kubectl config view --raw
  ```

**2nd Option (👉 Quick, but not recommended)**:

- Change the `google-cloud-sdk@latest` package to `path:gcloud#google-cloud-sdk` in the `devbox.json` file of project folder, which would change the devbox to use the `google-cloud-sdk` from the project `gcloud` folder that include `gke-gcloud-auth-plugin`.

### <a name="install-packages">⭐ Packages Installation</a>

- Open 1st terminal in project and install devbox packages by running:

  > **📌 Note**: It may take a bit long to install all devbox packages if you run this cli first time.

  ```bash
  devbox install
  ```

- **In 1st terminal for frontend**, runs clis to
  - get into devbox isolated environment
  - install frontend service packages

  ```bash
  devbox shell

  cd frontend

  npm install
  ```

- Open a new **2nd terminal for node-backend** and runs clis to 
  - get into devbox isolated environment
  - install node-backend service packages

  ```bash
  devbox shell

  cd node-backend

  npm install
  ```

- Open a new **3rd terminal for go-backend** and runs clis to 
  - get into devbox isolated environment
  - install go-backend service packages

  ```bash
  devbox shell

  cd go-backend

  go mod tidy
  ```

- Open a new **4th terminal for python-backend** and runs clis to 
  - get into devbox isolated environment
  - create a new virtual env in **Project Root folder** (a new `.venv` folder created)
  - activate python virtual env
  - install python-backend service packages in python virtual env

  ```bash
  devbox shell

  python3 -m venv .venv

  source .venv/bin/activate

  pip install -r ./python-backend/requirements.txt

  cd python-backend
  ```

### <a name="create-mongodb-cluster">⭐ Create a Cluster and DB in MongoDB</a>

Create a cluster, set up database name in MongoDB and note down **MongoDB Url string**.

- Create a free cluster by selecting a `free plan` and `Drivers` connection method under a project in MongoDB
- Copy your cluster **connection string**
- Add a **database name string** (eg. `ai_tools_db`) before `?retryWrites` string in the cluster **connection string**. Otherwise, the database will use `test` as default db name
- Note down the updated cluster **connection string** as `MONGODB_URL` env variable — you'll need it later in the **⭐ Set Up Environment Variables** step.

Set up public access for your MongoDB proejct

- Go to **SECURITY > Network Access** tab
- Click **ADD IP ADDRESS** button
- Click **ALLOW ACCESS FROM ANYWHERE** button
- Click **Confirm** button

### <a name="create-postgre-db-in-supabase">⭐ Create a PostgreSql DB in Supabase</a>

Create a PostgreSql database in Supabase

- Go to **dashboard** page in your Supabase account
- Click **New Project** button
- Choose an **organization** (or create one)
- Enter a **project name**
- Enter a **database password**
- Select a **region**
- Click **Create new project** button to create a database

Note down **Supabase Database Url string** as `DATABASE_URL` (Supabase) env variable — you'll need it later in the **⭐ Set Up Environment Variables** step.

- Go to the page of project just created
- Click **Connect** button on the top of page
- Copy the database url string in **Transaction pooler** section
- Replace `[YOUR-PASSWORD]` placeholder in database url to your project database password
- Note down the updated **Supabase Database Url string**

### <a name="create-postgre-db-in-neon">⭐ Create a PostgreSql DB in Neon</a>

Create a PostgreSql database in Neon

- Go to **dashboard** page in your Neon account
- Click **New Project** button
- Enter a **project name**
- Select a **PostgreSQL version** (default is fine)
- Select `AWS` for **Cloud service provider**
- Select a **region**
- Click **Create project** button to create a database

Note down **Neon Database Url string** as `DATABASE_URL` (Neon) env variable — you'll need it later in the **⭐ Set Up Environment Variables** step.

- Go to the page of project just created
- Click **Dashboard tab** in the left side bar
- Click **Connect** button on the top right of page
- Copy the **Connection string**
- Remove the ending `&channel_binding=require` string in the **Connection string** (Optional step)
- Note down the updated **Connection string** as **Neon Database Url string**

### <a name="create-redis-in-upstash">⭐ Create a Redis DB in Upstash</a>

Create a Redis database in Upstash

- Go to **dashboard** page in your Upstash account
- Click **Create Database** button
- Enter a **name** for database
- Select a **primary region** (eg. `us-east-1`)
- Enable **Eviction**
- Click **Next** button
- Select **Free Plan**
- Click **Next** button to create database

Note down **Redis Url string** as `REDIS_URL` env variable — you'll need it later in the **⭐ Set Up Environment Variables** step.

- Go to the page of database just created
- Hover on the **Endpoint** field to view the copy buttons
- Click **TCP** copy button to note down **Redis Url string**

### <a name="set-up-gcp-pubsub-and-gcs">⭐ Set up GCP Pub/Sub & Google Cloud Storage</a>

Create **topic and subscription** for GCP Pub/Sub by running

```bash
gcloud pubsub topics create my-first-topic

gcloud pubsub subscriptions create nodejs-subscription --topic=my-first-topic
```

Create **Google Cloud Storage bucket** and add **public Read access** to this bucket

- Go to GCP Google Cloud Storage Service
- Create a Google Cloud Storage bucket (eg. `ai-tools-gcs-bucket`)
- Click **the new created bucket > "Permissions" tab > "Grant access" button**
- Enter `allUsers` for **New principals** field and select `Storage Object Viewer` for **Role** field
- Click **Save** button

### <a name="get-google-gemini-api-key">⭐ Get Google Gemini API Key</a>

Get Gemini API Key (`GOOGLE_API_KEY` env) for Video Generation feature.

**🚨 Important Note**: 

> To use `veo-2.0-generate-001` AI model to generate a AI video with this API key, you must enable Billing for the `GOOGLE_API_KEY` in your GCP project. Also, the video generation via Veo2 costs around 💸💸 **0.35-0.50$ per second**💸💸

👉 If you are using **GCP new user first 3 months 300$ credit**, you are already has Billing enabled for the default GCP project

- Go to **APIs & Services** in GCP
- Click **Library** tab in side bar and search `gemini api`
- Enable `gemini api` access for all of 3 search results
- Click **Credentials** tab in side bar
- Click **"Create Credentials" button > "API key" button**
- Go to the page of API key just generated
- Select `IP addresses` for **Application restrictions**
- Add your `GKE Cluster Load Balancer external public IP`, `GKE Cluster worker nodes external public IPs`, `GCP VM external public IP` and `local machine IP` to **IP address restrictions**
- Click **Save** button
- Note down the generated **API key** as `GOOGLE_API_KEY` env variable — you'll need it later in the **⭐ Set Up Environment Variables** step.

👉 If you **don't have GCP new user free credit anymore**, you have to go to **Google AI Studio**, enable the Billing for **Gemini API** GCP project and generate a `GOOGLE_API_KEY` in **Google AI Studio**.

---

### <a name="set-up-gcp-services-authorization">⭐ Set up GCP services authorization for app</a>

Set up **GCP Cloud Pub/Sub** and **GCP Cloud Storage** services authorization for app.

**🚨 Important Note**: 

> This **⭐ Set up GCP services authorization for app** subsection is required to be finished **WHENEVER** deployed app into GKE K8S Cluster or into GCE VM with Docker in all app deployment sections.

**👉 Authorization for running app in GKE Cluster** - Finish it after deploying app in GKE cluster

- Create **Google IAM service account (GSA)** for app

  ```bash
  task general:01-create-GSA
  ```

- **Bind and annotate default Kubernate service account (KSA) with GSA**

  > **⚠️ Warning Note**: If a GSA with the correct GCP service permissions already exists — for example, after deleting a GKE K8S cluster and creating a new one — you only need to run these two CLIs.

  ```bash
  task general:02-bind-KSA-with-GSA

  task general:03-annotate-KSA-with-GSA
  ```

- Attach **GCP Pub/Sub permissions** to GSA

  ```bash
  task pubsubAccess:attach-pubsub-permissions-to-GSA
  ```

- Attach **GCP Cloud Storage admin permissions** to GSA

  ```bash
  task gcsAccess:attach-gcs-permissions-to-GSA
  ```

**👉 Authorization for running app in GCP VM** - Finish it after deploying app in GCP VM

- Find the **GCP VM's GSA**
  - Go to **GCP Console** > Go to **Compute Engine > VM instances**
  - Click on your VM
  - Scroll down to **Service account** (eg. `1234567890-compute@developer.gserviceaccount.com`)
  - Copy the **Google Service account (GSA) of GCP VM**

- Update `gceVmPubsubAccess:attach-pubsub-permissions-to-GCE-VM-GSA` and `gceVmGcsAccess:attach-gcs-permissions-to-GCE-VM-GSA` task CLIs in `Taskfile.yaml` file to use your own **VM GSA**.

- Attach required **GCP Pub/Sub access to the GSA of GCP VM** by running

  ```bash
  task gceVmPubsubAccess:attach-pubsub-permissions-to-GCE-VM-GSA
  ```

- Attach required **GCP Cloud Storage admin access to the GSA of GCP VM** by running

  ```bash
  task gceVmGcsAccess:attach-gcs-permissions-to-GCE-VM-GSA
  ```

- Enable `Cloud Pub/Sub` and `Storage` access of **Cloud API access scopes** for GCP VM if they are currently off.
  - Stop the current running GCP VM
  - Click **Edit** button in VM info page
  - Select `Set access for each API` for **Access scopes**
  - Select **Enable** for `Cloud Pub/Sub` and **Read Write** for `Storage`
  - Click **Save** button
  - Start GCP VM again

**👉 Authorization for running app in local machine**

- **📌 IF YOU DIDN'T FINISH** the previous step **(Authorization for running app in GKE Cluster)**, just **create a GSA with GCP Pub/Sub and GCS permissions attached**. You only need to **bind and annotate the default KSA with the GSA** when you complete that **step (Authorization in GKE Cluster) later**. **📌 IF YOU ALREADY FINISHED** the previous step, you can **SKIP** this GSA creation step.

  ```bash
  task general:01-create-GSA

  task pubsubAccess:attach-pubsub-permissions-to-GSA

  task gcsAccess:attach-gcs-permissions-to-GSA
  ```

- Download a google service account key file directly for local use

  ```bash
  task general:download-gsa-key-locally
  ```

- Move this key file **from you project to host Download folder** and find the absolute file path (eg. `/Users/evan/Downloads/ai-tools-gsa-local-key.json`) of your downloaded JSON credentials on macOS by running

  ```bash
  ls ~/Downloads/ai-tools-gsa-local-key.json
  ```

- Note down the absolute file path as `GOOGLE_APPLICATION_CREDENTIALS` env varabile — you'll need it later in the **⭐ Set Up Environment Variables** step.

---

### <a name="set-up-imagekit">⭐ Set up Imagekit.io</a>

- Create a **Imagekit.io** account.
- Note down the `privte key` and `imagekit id` in your **Imagekit.io** account as `IMAGEKIT_PRIVATE_KEY` and `IMAGEKIT_ID` env variable - you'll need it later in the **⭐ Set Up Environment Variables** step.

### <a name="set-up-vapi">⭐ Set up VAPI</a>

- Create a **VAPI** account.
- Note down the `public Key` from the **Vapi API Keys** tab in your **VAPI account dashboard** as `VITE_VAPI_PUBLIC_KEY` env variable - you'll need it later in the **⭐ Set Up Environment Variables** step.

**⚠️ Warning Note**:

> Vapi requires `HTTPS` to start a call (the access microphone and camera), so make sure you set up a `SSL/TLS` certificate for the deployed app.

### <a name="set-up-clerk">⭐ Set up Clerk & Clerk Billing</a>

Get the **Clerk auth key**

- Create a project under your Clerk account
- Go to **Configure tab > API keys tab**
- Select `React` and Copy the `VITE_CLERK_PUBLISHABLE_KEY` value as `VITE_CLERK_PUBLISHABLE_KEY` env variable - you'll need it later in the **⭐ Set Up Environment Variables** step.

Set up **payment in Clerk Billing**

- Go to **Subscription tab > Get started button**
- Click **Create a plan** button to create first billing plan
- Click the auto created `Free` plan
- Enter `Perfect for exploring our AI tools and testing what’s possible.` text for **Description**
- Click **Add feature** button for adding new features for current `Free` plan
  - Enter `5 image editings per month` for **Name**
  - Click **Create feature** button
  - Add more features by following same steps again
- Click **Save** button
- Add more plans by following same steps again
- Go to **Configure tab > Billing tab > Settings tab > Enable Billing button** after finishing adding all plans and corresponding features.

### <a name="set-up-rabbitmq">⭐ Set up RabbitMQ in CloudAMQP</a>

- Create a **CloudAMQP RabbitMQ** account with a free default cluster created
- Create a free **RabbitMQ Little Lemur** instance
- Note down the `AMQP URL` (eg. `amqps://user:pass@host.rmq.cloudamqp.com/vhost`) as `RABBITMQ_URL` env variable - you'll need it later in the **⭐ Set Up Environment Variables** step.

### <a name="set-up-kafka">⭐ Set up Kafka in Redpanda Cloud (DEPRECATED)</a>

**⚠️⚠️ DEPRECATED NOTE ⚠️⚠️**: 

> This step is DEPRECATED because `Kafka` in **Redpanda Cloud** is not free, so I switched to use **CloudAMQP RabbitMQ** for the communication between **Node.js service and Python service**.

- Create a **Redpanda Cloud** account with a free default cluster created
- Click **Kafka API** button in Cluster Overview page
- Note down the value of `Bootstrap server URL` as `KAFKA_BOOTSTRAP_SERVER` env variable - you'll need it later in the **⭐ Set Up Environment Variables** step.
- Click **Manage credentials** button and create a user with userName (eg. `ai-tools-redpanda-user`) and password.
- Note down the value of `password` as `KAFKA_SASL_USER_PASSWORD` env variable - you'll need it later in the **⭐ Set Up Environment Variables** step.
- Select **ACLs** tab and click the new created user (eg. `ai-tools-redpanda-user`)
- Click **Allow all operations** and **Save** buttons

### <a name="set-up-env-variables">⭐ Set Up Environment Variables</a>

Create a `.env` file under **frontend** folder of your project and add the following content:

```env
VITE_CLERK_PUBLISHABLE_KEY=
VITE_VAPI_PUBLIC_KEY=
```

Create a `.env` file under **node-backend** folder of your project and add the following content:

> **⚠️ Warning Note**: The `DATABASE_URL` of **node-backend** is from **Supabase**. Also, the `Kafka` credentials are no longer required because Kafka in Redpanda Cloud is **deprecated**.

```env
DATABASE_URL=

GOOGLE_APPLICATION_CREDENTIALS=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

RABBITMQ_URL=

KAFKA_BOOTSTRAP_SERVER=
KAFKA_SASL_USER_PASSWORD=
```

Create a `.env` file under **go-backend** folder of your project and add the following content:

> **⚠️ Warning Note**: The `DATABASE_URL` of **go-backend** is from **Neon**.

```env
DATABASE_URL=

GOOGLE_API_KEY=

GOOGLE_APPLICATION_CREDENTIALS=

IMAGEKIT_ID=
IMAGEKIT_PRIVATE_KEY=

CLERK_SECRET_KEY=
```

Create a `.env` file under **python-backend** folder of your project and add the following content:

> **⚠️ Warning Note**: The `Kafka` credentials are no longer required because Kafka in Redpanda Cloud is **deprecated**.

```env
REDIS_URL=
MONGODB_URL=

IMAGEKIT_PRIVATE_KEY=

CLERK_SECRET_KEY=

RABBITMQ_URL=

KAFKA_BOOTSTRAP_SERVER=
KAFKA_SASL_USER_PASSWORD=
```

Replace the placeholder values with the actual credentials you noted down previously.

### <a name="running-project">⭐ Running the Project</a>

After finishing **⭐ Packages Installation** step, you installed necessary packages for all services and had **4 open terminal**. Now, run the following CLIs to start the app:

**In 1st terminal for frontend** – Start the Frontend Service (React Vite App):

```bash
npm run dev
```

**In 2nd terminal for node-backend** – Start the Node-backend Service (Nodejs Express app):

```bash
npm run dev
```

**In 3rd terminal for go-backend** – Start the Go-backend Service (Go Gin app):

```bash
air
```

**In 4th terminal for python-backend** – Start the Python-backend Service (Nodejs Express app):

```bash
flask run --reload --port=8088
```

🎉 Now, you can access your app at [http://localhost:5173/](http://localhost:5173/) in browser.

---

## <a name="deploy-app-in-gce-with-docker-compose">☁️🐳 GCE(GCP) VM: Deploy App with Docker Compose 🐳</a>

**Docker Compose** runs containers locally without using Docker Swarm services (the orchestrator layer). Also, Docker Compose use minimal VM CPU and memory.

**📌 If your VM has enough CPU and Memory**, it would be best to deploy this microservices project as **K8s cluster using k3s** or as **docker containers using Docker swarm**, so that we can taking **advantanges** of these **k8s cluster orchestrator or container orchestrator**. The **Pros to use orchestrator instead of Docker compose**:

- Allow us to **deploy new app version without downtime** and **easily roll back the version**
- Allow us to **run containers in differeent hosts/nodes/VMs** for better scalabity
- Provide a way to **handle sensative credentials or secrets**

Follow the steps to deploy app using `docker-compose.yml` file in GCE VM:

### <a name="set-up-gce-vm">⭐ Set up GCE VM</a>

**1 -** Go to **GCP Compute Engine service**

**2 - Create a free** `e2-micro` **VM** in GCE
- Click **Create instance** button in overview page
- Click **Enable Compute Engine API** button
- Go back to **Compute Engine > VM instances**
- Click **Create instance** button after **Compute Engine API** is enabled

- **Machine Config section**
  - Enter your desired **Name** tag (eg. `appName-gce-free-vm`)
  - Select a **free VM region and zone** (eg. `us-central1` and `us-central1-a`)
  - Select `E2` for VM **Series** and `e2-micro` for **Machine type** below the **Machine Series** chart
  - Click **Advanced configurations** button
  - Make sure **vCPUs to core ratio and Visible core count** are selected to `None`
  - Lastly, select `OS and storage` section in left side bar

- **OS and storage section**
  - Click **Change** button
  - Select `Debian` and `Debian 11 (bullseye)` for **OS and version**
  - Select `Standard persistent disk` for **disk type**
  - Keep `10 GB` for **Size** by default
  - Click **Select** button
  - Lastly, select `Data protection` section in left side bar

- **Data protection section**
  - Select `No backups` for **Back up your data**
  - **Disable** all check boxs for **Continuously replicate data for disaster protection**
  - Lastly, select `Networking` section in left side bar

- **Networking section**
  - Enable `Allow HTTP traffic` and `Allow HTTPS traffic`
  - Leave the rest of things as default

- Click **Create** button

**3 - Reserved a free static externalIP** with same region of VM's region and **attach it to VM**

- Open a anther broswer tab and go to **VPC networks > IP addresses** in GCP
- Click **Reserve external static IP address** button
- Enter your desired **Name** tag (eg. `appName-static-external-ip`)
- Select `Standard` for **Network Service Tier**
- Select `IPv4` for **IP version**
- Select `Regional` for **Type**
- Select same region as the region of your VM (eg. `us-central1`) for **Region**
- Select your VM (eg. `appName-gce-free-vm`) for **Attached to**
- Click **Reserve** button

### <a name="deploy-app-gce-vm">⭐ Deploy app in GCE VM</a>

TODO: test it

**🚨 Important Note**:

> The CLI to **update user permissions for accessing Docker** must be run for the user connected VM to access Docker whenever the **VM reboots and Docker auto-restarts**.

**1 - Install required dependencies in VM**

- Go to **Google Compute Engine > VM instances**
- Select the VM instancee just created
- Click **SSH** to connect VM
- Installs **Docker engine** by running

  ```bash
  curl https://get.docker.com/ | sh
  ```

- **Update user permissions for accessing Docker**

  ```bash
  sudo chown $USER /var/run/docker.sock
  ```

- Verify user's Docker access

  ```bash
  docker ps
  ```

**2 - Deploy app** by running app containers with `docker-compose.yaml` file

- Create a folder

  ```bash
  mkdir dockerComposeFolder

  cd dockerComposeFolder
  ```

- Add `docker-compose.yml` file to folder 
  - Copy the file content in local `docker-compose.yml` file, 
  - Run below CLI 
  - Paste the copied file content 
  - Press `control + X`, `Y`, and `Enter` keys in keyboard

  ```bash
  nano docker-compose.yml
  ```

- **🚨 Important Step**: Set up **🐳 Docker Hub and build app container images & upload them to Docker Hub** by following the steps in **⭐ Build App Container Images & Upload them to Docker Hub** subsection, **IF YOU DIDN'T FINISH** **⚙️ Run App in Kind Cluster Locally** section.

- **Deploy stack of app containers** with `docker-compose.yml` by running:

  > **📌 Note**: 2nd CLI would run containers in the background

  ```bash
  docker compose -f docker-compose.yml up

  OR

  docker compose -f docker-compose.yml up -d
  ```

- **🚨 Important Step**: Set up **Authorization for running app in GCP VM** by following the steps in **⭐ Set up GCP services authorization for app** subsection.

- 🎉 Now, You can access your app with your **VM external IP address** (eg. `http://35.209.142.39/`)
  > **📌 Note**: If you can not access it with your VM external IP, you can try to access your app in **8080 port** (eg. `http://35.209.142.39:8080`).Because the `frontend` container’s port 8080 may be exposed on the VM’s port 8080.
  >
  > Alternatively, you can change to **expose container’s port 8080 on the VM’s default port 80** by changing the `ports` of `frontend` to be `- 80:8080` in `docker-compose.yml` file and redeploy the app containers to try again.

- **📌 Useful Docker CLIs**: 
  - turn down the containers 
  - list running containers 
  - list all containers (running + stopped)
  - list Docker images on system
  - check details on a specific container
  - check logs on a specific container

  ```bash
  docker compose -f docker-compose.yml down

  docker ps

  docker ps -a

  docker images

  docker inspect <container_id_or_name>

  docker logs <container_id_or_name>
  ```

TODO: Test it

**3 -** Set up **Docker engine and app containers to auto-restart** if **VM reboots**

- Set the **Docker daemon restart automatically at VM reboots**.
  - 1st CLI is to **turn on the existing systemd service file** of `Docker`, so that `Docker` auto-restart when VM or system reboots. (systemd service file of `Docker` is created when installing `Docker`, but it is not enabled automatically.)
  - 2nd CLI is to verify the `Docker` systemd service is active or not.

  ```bash
  sudo systemctl enable docker

  systemctl is-enabled docker
  ```

- Make sure that we are using `restart: unless-stopped` for all app contaiers in `docker-compose.yml` file, which is what we already did. **This resart policy set Docker to**:
  - **Restart the container automatically if it crashes**
  - Also **restart it on VM reboot**

- **Test restart by simulating a VM reboot** and check the container status after the VM boots

  ```bash
  sudo reboot

  docker ps
  ```

### <a name="set-up-domain-and-https">⭐ Set up Domain & HTTPS</a>

**1 - Set up a Domain Name** for your web app

Get a free subdomain in **Duck DNS** and **bind it to your VM static external IP address**

**🚨 Important Note**: 

> **if you own a custom domain**, you can easily bind your domain with VM static external IP address with a free SSL certificate by using `Cloudflare`. 
>
> Then, you **don't need set up HTTPS by your own** in later step and don't need to keep running `Nginx` (use defualt `80` port for `HTTP`, `443` port for `HTTPS`) in VM to serve your web app over HTTPS using that SSL certificate. 
>
> This allow you to use `- 80:8080` as the `ports` of `frontend` in `docker-compose.yml` file because you don't need `Nginx` to proxy incoming request traffic to `frontend` container anymore.

- Go to Duck DNS page (`https://www.duckdns.org/`)
- Enter your desired **sub domain** name (eg. `appName-yourName`) in **domains** section
- Click **add domain** button
- Enter your VM static external IP address (eg. `35.209.142.39`) in **current ip** field
- Click **update ip** button
- You can access the app with your subdomain via only `http` (eg. `http://appName-yourName.duckdns.org/`) now

**2 - Get a free SSL/TSL certificate (HTTPS) via Nginx and Certbot for domain name**

- Connect to VM in GCP console
- Stop all running app containers

  ```bash
  docker compose -f docker-compose.yml down
  ```

- Install `Snap` and `nginx` packages

  ```bash
  sudo apt update

  sudo apt install snapd -y

  sudo snap install core

  sudo snap refresh core

  sudo apt install nginx
  ```

- Install `Certbot` via `Snap`

  ```bash
  sudo snap install --classic certbot

  sudo ln -s /snap/bin/certbot /usr/bin/certbot
  ```

- Run `Certbot` with `Nginx` to get a **SSL certificate**

  > **🚨 Important Error**: If you get `port 80 is used` error, when running this CLI.
  >
  > **✅ Solution of Error**: You need to reserve port `80` for `nginx` by killing all existing processes listening to port `80`. Also, make sure the `ports` of `frontend` is set to `- 8080:8080` in `docker-compose.yml` file.

  - This CLI would do:
    - **Certbot obtains and installs the SSL certificate via Let's Encrypt**
    - It **configures your Nginx to use the certificate**
    - The **cert is saved on disk** (usually in /etc/letsencrypt/)

  ```bash
  sudo certbot --nginx -d appName-yourName.duckdns.org
  ```

**3 - Set up Nginx in VM for incoming traffic routing**

Update `Nginx config` to proxy the incoming traffic to `8080` port of VM ( `8080` port of `frontend` container) by:

- First, run the CLI to open `Nginx config` file

  ```bash
  sudo nano /etc/nginx/sites-available/default
  ```

- Secondly, try to find the specific `server block` containing the **existing script**. The **existing** `Nginx config` server block:

  ```bash
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

- Thirdly, **replace** the existing `location /` block (inside this `server block` only) with **updated script** and **save the updated Nginx config file**. The **updated script** for `locaton / block`:

  ```bash
  location / {
      proxy_pass http://localhost:8080;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
  }
  ```

- **Reload Nginx** again after updating and saving `Nginx config` file.

  ```bash
  sudo nginx -t

  sudo systemctl reload nginx
  ```

**4 - Potential errors when reloading Nginx**

**🚨 Important Error 1**: 

If you **get this error**, `nginx.service is not active, cannot reload`, when you **reload Nginx**.

**✅ Solution of Error 1**: 

You can start `nginx` and check status. If the status is `Active: active (running)`, you are good to skip the steps of **Important Error 2** because you may not encounter it.

```bash
sudo systemctl start nginx

sudo systemctl status nginx
```

**🚨 Important Error 2**:

If you run into **a new error**, `Job for nginx.service failed because the control process exited with error code`, when starting `nginx` in **Solution of Error 1**. This means there are other running processes listening to ports `80 or 443`.

**✅ Solution of Error 2**: 

- Try to find out those running processes first by running

  ```bash
  sudo apt install lsof

  sudo lsof -i :80 -sTCP:LISTEN

  sudo lsof -i :443 -sTCP:LISTEN
  ```

- If any of those process aren't `Nginx`, run the CLI to kill them manually.

  ```bash
  sudo kill -9 <PID>
  ```

- After all running process of ports `80 or 443` is only `Nginx`, we can:
  - Run **1st CLI** to check `Nginx status`
  - If `Nginx status` is `Active: failed` status, try to **kill all Nginx processes** by running **2nd CLI**
  - Run **3rd CLI** to restart `Nginx`
  - Run **1st CLI** to check `Nginx status` again
  - The `Nginx status` should be `Active: active (running)` now

  ```bash
  sudo systemctl status nginx

  sudo pkill nginx

  sudo systemctl start nginx
  ```

**5 - Check auto-renew of SSL certificate and deploy app again**

- **Test if SSL certificate auto-renew is handled or not**

  ```bash
  sudo certbot renew --dry-run
  ```

- **Restart all app containers again**

  ```bash
  docker compose -f docker-compose.yml up -d
  ```

- 🎉 Now, you can access your app via `https` (eg. `https://appName-yourName.duckdns.org`) in browser after **your domain has a free SSL certificate**.

TODO: Test it

**6 - Set up Nginx in VM to auto-restart** if **VM or system reboots**

- Set the **Nginx in VM restart automatically at VM reboots**.
  - 1st CLI is to **turn on the existing systemd service file** of `Nginx`, so that `Nginx` auto-restart when VM or system reboots. (systemd service file of `Nginx` is created when installing `Nginx`, but it is not enabled automatically.)
  - 2nd CLI is to verify the `Nginx` systemd service is active or not.

  ```bash
  sudo systemctl enable nginx

  systemctl is-enabled nginx
  ```

- **Test restart by simulating a VM reboot** and check `Nginx` and `Docker containers` status after the VM boots

  ```bash
  sudo reboot

  sudo systemctl status nginx

  docker ps
  ```

## <a name="deploy-app-in-gce-with-docker-swarm">☁️🐳🐳 GCE(GCP) VM: Deploy App with 🐳🐳 Docker Swarm 🐳🐳</a>

**Deploy app as Docker services that manage tasks (containers) via Docker Swarm**.

- `Docker service` is **top-level Swarm object** that manages desired state (e.g. `replicas: 3`, which image to use), scaling, and containers used by **Docker Swarm**. You don't run containers directly. You define services, and Swarm runs containers to satisfy the service.
- In **Docker Compose**, `Docker service` **isn't a first-class object** because Docker Compose spins up containers directly without creating services.
- You still can use `docker ps` CLI to view Docker container status in **Docker Swarm**.
- **Docker Swarm uses more VM CPU and memory than Docker Compose** beucase running Docker Swarm orchestrator use around 200MB memory.

**🚨Important Step**: 

The previous **☁️🐳 GCE(GCP) VM: Deploy App with Docker Compose 🐳** section is required to be finished first before starting this section, **IF YOU DIDN'T FINISH** this previous section yet.

### <a name="deploy-app-gce-vm-with-docker-swarm">⭐ Deploy app in GCE VM with Docker Swarm</a>

- Connect to VM in Google Compute Engine console
- Turn off all running containers first by running

  ```bash
  docker compose -f docker-compose.yml down
  ```

- Clean up existing all images and containers first to save VM resource

  ```bash
  docker rm -f $(docker ps -aq)

  docker rmi -f $(docker images -q)
  ```

- Check Disk Usage of Docker

  ```bash
  docker system df
  ```

- **Enable Docker Swarm mode** in Docker

  ```bash
  docker swarm init
  ```

- Create a folder

  ```bash
  mkdir dockerSwarmFolder

  cd dockerSwarmFolder
  ```

- Add `docker-swarm.yml` file to folder 
  - Copy the file content in local `docker-swarm.yml` file
  - Run below CLI 
  - Paste the copied file content 
  - Press `control + X`, `Y`, and `Enter` keys in keyboard

  ```bash
  nano docker-swarm.yml
  ```

- **Create docker secrets** for **Docker swarm services to consume**
  - Remember to replace `secret placeholder` string to real `secret string`
  - Create secrets for **all env variables** if there are more secrets added later
  - The **raw bytes secret** stored within the **Swarm manager nodes** will be available inside the container **as a file** at: `/run/secrets/secret-name` (eg. `/run/secrets/redis-url`)
  - The `Kafka credentials` are **no longer required** because Kafka in Redpanda Cloud is **deprecated**

  ```bash
  printf 'secret placeholder' | docker secret create supabase-postgres-database-url -

  printf 'secret placeholder' | docker secret create neon-postgres-database-url -

  printf 'secret placeholder' | docker secret create google-api-key -

  printf 'secret placeholder' | docker secret create go-imagekit-id -

  printf 'secret placeholder' | docker secret create go-imagekit-private-key -

  printf 'secret placeholder' | docker secret create redis-url -

  printf 'secret placeholder' | docker secret create mongodb-url -

  printf 'secret placeholder' | docker secret create python-imagekit-private-key -

  printf 'secret placeholder' | docker secret create clerk-publishable-key -

  printf 'secret placeholder' | docker secret create clerk-secret-key -

  printf 'secret placeholder' | docker secret create rabbitmq-url -

  printf 'secret placeholder' | docker secret create kafka-bootstrap-server -

  printf 'secret placeholder' | docker secret create kafka-sasl-user-password -
  ```

- **🚨 Important Step**: Set up **🐳 Docker Hub and build app container images & upload them to Docker Hub** by following the steps in **⭐ Build App Container Images & Upload them to Docker Hub** subsection, **IF YOU DIDN'T FINISH** **⚙️ Run App in Kind Cluster Locally** section.

- **Deploy stack of app containers** with `docker-swarm.yaml` file

  ```bash
  docker stack deploy -c docker-swarm.yml ai-tools
  ```

- **List all Docker services status and view the nodes in the swarm**
  
  ```bash
  docker service ls

  docker node ls
  ```

- 🎉 Now, You can access your app with your **VM external IP address** (eg. `http://35.209.142.39/`)

- **🚨 Important Step**: Set up **Authorization for running app in GCP VM** by following the steps in **⭐ Set up GCP services authorization for app** subsection, **IF YOU DIDN'T FINISH** the previous **☁️🐳 GCE(GCP) VM: Deploy App with Docker Compose 🐳** section.

- **🚨 Important Step**: Set up **domain and SSL/TSL certificate** by following the steps in **⭐ Set up Domain & HTTPS** subsection, **IF YOU DIDN'T FINISH** the previous **☁️🐳 GCE(GCP) VM: Deploy App with Docker Compose 🐳** section.

- 🎉 Now, You can access your app via `https` (eg. `https://appName-yourName.duckdns.org`) in browser.

### <a name="potential-app-latency-issue-in-swarm">⭐ Potential App Latency Issue in Swarm</a>

**🚨 Potential Issue**:

If your **GCE VM is free** `e2-micro` type, your app may becomes **much slower** including accessing the web page and internal api calls **after deploying via Docker Swarm**, **comparing to** running the same containers with **Docker Compose**.

**💡 Reason of Issue**:

These are some reasons for the extra latency issue **introduced by the Swarm architecture** by default when **comparing Docker Swarm with Docker Compose**:

- **🐳 Docker Swarm 🐳** is desgined to used across **mutiple VMs**. Swarm would use the **across VMs mechanism** to **handle the requst traffic between services** even if we are running it **in 1 VM**.
  - The **Swarm Load Balancer** and **a virtual IP (VIP) for each service** are **automatically created** when you deploy services in **Docker Swarm mode**.
  - It's a built-in mechanism that **Swarm Load Balancer** uses `VIP(Virtual IP)-based load balancing` and `Routing mesh` for internal routing (traffic between containers, even across nodes).
  - Docker Swarm uses the `overlay network (VXLAN)` for multi-node setups, which adds packets or **network encapsulation** (`wrapped, routed, and unwrapped steps for a requst`). This **encapsulation step still happens** even if it is **service commnunication within same VM**.
  - Swarm is `cluster-first`, so it **doesn’t skip** the `Routing mesh or VXLAN` even if there’s only 1 node — it assumes more nodes could join at any time.
  - Above mechanism causes **higher latency, more CPU and network stack usage, slower service-to-service communication** even if everything is running on the 1 VM.

- **🐳 Docker Compose** is desgined to used in **1 VM**.
  - Docker Compose uses the `bridge network`, allow a container talk to other containers **without network encapsulation** (`wrapped, routed, and unwrapped steps for a requst`) or **VIP(Virtual IP) translation**.
  - **Simple local networking** on the **same VM**.
  - Fastest path: direct, local **TCP/IP traffic**.
  - Above mechanism causes **low latency and minimal CPU/network overhead**

**✅ Solution of Issue**:

You can try one or more of the solutions below to fix the issue or improve app latency:

- **1st Solution (👍 Recommended)**: Switch back to use **Docker Compose** to deploy app **if you are ok with these Cons**

  - Deploy **new app version with a few seconds of app downtime**
  - **Unable to scale up VM/node number** in future
  - Handle **sensative credentials** or secrets by your own

- **2nd Solution (👍 Recommended)**: **Stop running** `Nginx` in VM for incoming traffic routing and SSL/TLS encryption

  - **Stop running** `Nginx` that is serving SSL/TLS certificate and acting as a reverse proxy (proxy routing incoming traffic to `frontend` container) **in VM**. 
  - **Disable** the `Nginx` to auto-restart entirely **on VM reboots**.
  - Update `frontend` service in `docker-swarm.yaml` file to directly publish on `port 80` inside the swarm.
  - **Redeploy app** in Docker Swarm again.
  - Now you can only access page with `http`, but the app latency would be improved. 
  - BTW, **Vapi requires `HTTPS` to start a AI Voice call**.
  - You can make your app to be accessed with `https` by **buying a domain from some domain providers** (eg. `Namecheap`, `GoDaddy`, `Squarespace`) first, and then easily **creating a DNS record** and setting up `SSL/TLS` to use `Flexiable encription mode` in **CloudFlare**.

- **3rd Solution**: 💸 **Pay to upgrate your free VM to a higher machine type** for getting more CPU and RAM.

### <a name="set-up-auto-restart">⭐ Set up Auto-restart when VM Reboots</a>

TODO: Test it

Set up **Docker Swarm, Docker Swarm Services (running apps inside Docker Swarm) and Docker Swarm secrets to auto-restart** after **VM reboots**.

**Docker Swarm and Docker Swarm Services (running apps inside Docker Swarm)**:

- **🚨 Important Step**: Set up **Docker Engine and Nginx** to auto-restart in VM reboots, **IF YOU DIDN'T FINISH** the previous **☁️🐳 GCE(GCP) VM: Deploy App with Docker Compose 🐳** section. You can set it up here by running:

  ```bash
  sudo systemctl enable docker

  systemctl is-enabled docker

  sudo systemctl enable nginx

  systemctl is-enabled nginx
  ```

- The Docker Swarm and the Docker Swarm Services (running apps inside Docker Swarm) **will auto-restart too after VM reboots because**
  - **Swarm stores service definitions and desired state** in the `Raft store` under `/var/lib/docker/swarm/` on disk.
  - **When Docker Engine restarts, Swarm reboots as well**. Any **Docker Swarm Services** not currently running will **be re-deployed automatically** by the **Swarm manager** with Swarm Services.

**Docker Swarm secrets** persist even if the **Swarm manager node restarts or the VM reboots** because Swarm stores secrets in the `Raft log` that is Persisted on disk in `/var/lib/docker/swarm/`.

- But, the **secrets** used by Swarm Services **would be deleted** if there is only **1 manager node** and **that gets destroyed**.
- So, We **need to recreate the secrets** if we want to **start swarm mode again after leaving swarm mode** by running `docker swarm leave --force` CLI that would **delete all stored secrets**.


### <a name="network-routing-explanation-in-gce-vm">⭐ Network Routing Explanation in GCE VM</a>

TODO: move this subsection to Docker compose section?

1 - App network routing explanation in 1 node Docker Swarm

Below explanation is for 1 node Docker Swarm or Docker Compose?

**The Network Routing Explanation between app user in browser and docker container of frontend app**

- **Requirment 1**: The **firwall of VPC network** that VM lives in allows inbound traffic on `http port 80` and `hppts port 443`
- **Requirment 2**: **No other service conflicts** on `port 80` or `port 443` on the VM

**👉 The case of running `Nginx` in VM**:

- **Default behaviour** of running `Nginx` **after installation**.
  - When we installed and run `Nginx` in VM, it does bind to `0.0.0.0` by default, which means **it listens on all network interfaces — public and private IPs of VM**.
  - When running `Nginx`, it uses default `port 80 (HTTP)` and default `443 (HTTPS)` of VM by default.
  - We configed the `running Nginx` in VM serves a `SSL/TSL` certicate, which allows user to access VM by `https`.

- App user in browser **->** `https port 443` in VM
  - So, when app user enters VM's public external IP with `https port 443` by default (eg. `https://172.18.0.2`) in browser.
  - The app user would access the running `Nginx` in VM.

- `https port 443` in VM **->** `http port 8080` in VM
  - We configed the `Nginx config` file in VM with `proxy_pass http://localhost:8080`.
  - This config would set `Nginx` as a proxy to forward all incoming traffic (default `https 443 port`) to `http://localhost:8080` of VM.

- `http port 8080` in VM **->** `http port 8080` in container (`frontend` app)
  - We set the `ports` of `frontend` service to be `8080:8080` in `docker-compose.yml` and `docker-swarm.yml` files.
  - Docker publishes port with `8080:8080`, so that Docker maps VM’s `port 8080` to `frontend` service container’s port `8080`.
  - As a result, Docker handles **forwarding traffic** from `VM’s port 8080` -> `http port 8080` in container (`frontend` app).

- `http port 8080` in container (`frontend` app) **->** the running `frontend` app
  - We set `server { listen 8080; ...}` in the `nginx.conf` file. The `Nginx` serving `frontend app` will **bind host to all interfaces** `(0.0.0.0)` or **listen to all network interfaces** by default if we don't sepcify a host explicitly.
  - `nginx.conf` file is used as config file for the base image,`nginxinc/nginx-unprivileged:1.23-alpine-perl`, of `frontend` container image.
  - So, `frontend` app is running on port `8080` of container and listens on `0.0.0.0:8080`.
  - That means the running `frontend` app on port `8080` is accessible from both external sources of container and the container's localhost.
  - As a result, VM has access to the running `frontend` app inside container on this `8080` port.

**👉 The case of `NO Nginx` in VM**:

- App user in browser **->** `http port 80` in VM
  - So, when app user enters VM's public external IP with `http port 80` by default (eg. `https://172.18.0.2`) in browser.
  - The app user would access the `http port 80` in VM.

- `http port 80` in VM **->** `http port 8080` in container (`frontend` app)
  - We set the `ports` of `frontend` service to be `80:8080` in `docker-compose.yml` and `docker-swarm.yml` files.
  - Docker publishes port with `80:8080`, so that Docker maps VM’s `default http port 80` to `frontend` service container’s port `8080`.
  - As a result, Docker handles **forwarding traffic** from VM’s `default port 80` -> `http port 8080` in container (`frontend` app).

- `http port 8080` in container (`frontend` app) **->** the running `frontend` app
  - We set `server { listen 8080; ...}` in the `nginx.conf` file. The `Nginx` serving `frontend app` will **bind host to all interfaces** `(0.0.0.0)` or **listen to all network interfaces** by default if we don't sepcify a host explicitly.
  - `nginx.conf` file is used as config file for the base image,`nginxinc/nginx-unprivileged:1.23-alpine-perl`, of `frontend` container image.
  - So, `frontend` app is running on port `8080` of container and listens on `0.0.0.0:8080`.
  - That means the running `frontend` app on port `8080` is accessible from both external sources of container and the container's localhost.
  - As a result, VM has access to the running `frontend` app inside container on this `8080` port.

**The Network Routing Explanation between docker container of frontend app and docker containers of all backend apps**

- From previous `The Network Routing Explanation between app user in browser and docker container of frontend app` subsection, we know the **api calls** from app user's browser would be forwarded to the `Nginx` serving `frontend app`.

- We set `proxy_pass` in the `nginx.conf` file. The `Nginx` serving `frontend app` would **forward all incoming traffic** to the destination we specify.

- We set `proxy_pass http://go-backend:8000/`, to forward all `/api/go/` api calls to the `8000` port of `go-backend` container.
  - `go-backend` in `http://go-backend:8000/` is **Docker service name**, and containers can communicate using the service name as the hostname in **Docker Compose** and **Docker Swarm** (Swarm extends this across multiple nodes).
  - **Docker DNS** resolves Docker service name to the container's internal IP on the shared network.
  - The api call request is sent over Docker’s virtual network from `frontend` service container to `go-backend` service container.

- `go-backend` app running inside `go-backend` service container is listening on `0.0.0.0:8000` (**listening to all network interfaces**), so it accepts the incoming api call request.

- **📌 Note 1**: if `go-backend` app is not set to listen on all network interfaces, `0.0.0.0`, app will reject the request.
- **📌 Note 2**: We should use `http://docker service name:port/` instead of `http://localhost:8000/` because frontend app is running on different containers from all other backend apps.
- Same logic for `proxy_pass http://node-backend:3000/`
- Same logic for `proxy_pass http://python-backend:8088/`

## <a name="deploy-app-in-gke">☁️☸️ GKE (GCP): Deploy App in K8s Cluster</a>

Follow these steps to deploy app in GKE:

### <a name="create-vpc-subnet-k8s-cluster">⭐ Create VPC, Subnet and K8s Cluster</a>

**1 - Switch to `devbox` project isolated environment first**

```bash
devbox shell
```
 
**2 -** Authenticate `gcloud CLI` and create VPC and subnet

- Authenticate and configure the `gcloud CLI`
  - Select `Re-initialize the configuration` for **Pick up configuration to use** or `Create a new configuration` if you have not initailize before
  - Loggin into your google account
  - Pick up a **google cloud project** you want to use
  - Configure a **default Compute Region and zone** by selecting `us-central1-a` 
  - **📌 Note**: if you select a different region and zone, you should update them in local `Taskfile.yaml` file too

  ```bash
  task gcp:01-init-cli
  ```

- Enable all required **GCP APIs**

  ```bash
  task gcp:02-enable-apis
  ```

- Create a **custom VPC** instead of using the default VPC of the project

  ```bash
  task gcp:04-create-vpc
  ```

- Create a **subnet** for `us-central1-a` region under VPC

  ```bash
  task gcp:05-create-subnet
  ```

**3 -** Create a **GKE cluster**

- Update `GCP_PROJECT_ID` in local `Taskfile.yaml` file to be the google cloud project id you selected when setting up gcloud CLI authentication.

- Create a **Standard GKE cluster** with `e2-standard-2` machine type and **2 worker nodes (VMs)**.

  ```bash
  task gcp:06-create-cluster
  ```

- You can use `kubectl` on your **project devbox** to interact with the GKE cluster now.
  - 1st CLI is to check if GKE cluster is in Kubernetes contexts. Please make sure you **are using GKE cluster** in `kubectx` (Swith cluster by running `kubectx <custer-context-name>` CLI).
  - 2nd and 3rd CLIs are to view the current (GKE) cluster's worker nodes and system pods

  ```bash
  kubectx

  kubectl get nodes

  kubectl get pods -A
  ```

### <a name="set-up-k8s-cluster">⭐ Set up K8s Cluster</a>

**1 -** Create `ai-tools` namespace

- Create **namespace**, `ai-tools`, for grouping app services resources

  ```bash
  task common:apply-namespace
  ```

**2 - Deploy Traefik** ingress controller in GKE Cluster

- Deploy **Traefik ingress controller with Load Balancer serivce**

  > **🚨 Important Note**: It will provision a **Load Balancer with an ExternalIP** assigned by Traefik default setting, so it will cause **Load Balancer and ExternalIP fee 💸💸** if you run it in **GKE Cluster**.

  ```bash
  task common:deploy-traefik
  ```

- Check all resources in traefik namespace

  ```bash
  kubectl get all -n traefik
  ```

- Apply the **Traefik middleware to strip path prefix** for all incoming requests by ingress controller

  ```bash
  task common:apply-traefik-middleware
  ```

**3 -** Deploy **external secrets** for app services to consume

**🚨 Important Note**: 

> Please change all the usages of `GCP project ID` in `external-secrets-k8s-resource-defins` folder to be your own GCP project ID before starting this step.
>
> We will only store the secrets of **python backend service** into GCP Secret Manager becaues **GCP Secret Manager only offer 6 secret version (including create and update a secret) per month**. Also, holding a serect costs **$0.06 💸💸** per active secret version per month.

- Go to **GCP Secret Manager**
- Click **CREATE SECRET** button
- Enter `mongodb-url-in-gcpsm` as secret name and copy paste your mongodb url to **Secret value** textare.
- Leave all the rest of things by default and click **CREATE SECRET** button.
- Follow the same steps again to create `redis-url-in-gcpsm` secret in Secret Manager.
- Install `External Secrets Operator (ESO)` via **Helm chart**, and a `K8s service account (KSA)` named `external-secrets` is created automatically in namespace as part of `External Secrets Operator (ESO)` Helm chart installation.

  ```bash
  task external-secrets:01-install-external-secrets
  ```

- Create a `GCP IAM service account (Google Service Account/GSA)` named `external-secrets`, attach **GCP Secret Manager access role** to this GSA, and **bind the KSA with the GSA** to allow the KSA to impersonate the GSA.

  ```bash
  task external-secrets:02-create-iam-service-account
  ```

- **Add GSA annotation to K8s Service Account**, so that a **workload Identity trust relationship is enabled** after finishing **both binding and annotation for KSA and GSA**. The workload Identity alllows the GKE workloads (eg. a pod) using the KSA to access GCP services (eg. `Secret Manager`).

  ```bash
  task external-secrets:03-annotate-kubernetes-service-account
  ```

- Set `External Secrets Operator` to look for **secrets in GCP Secret Manager** by appling `ClusterSecretStore` configuration

  ```bash
  task external-secrets:04-apply-cluster-secret-store
  ```

- Kick `External Secrets Operator` to **fetch secrets from GCP Secret Manager**. Then, **creates K8s Secrets** in sepecified namespace by appling `ExternalSecret` configuration.

  ```bash
  task external-secrets:05-apply-external-secret
  ```

- View the created K8s `SecretStore`, `ExternalSecret` and `Secret`

  ```bash
  task external-secrets:06-get-secretStore-and-externalSecret-and-secret
  ```

- View the **secret value** from the **Kubernetes api**

  ```bash
  task external-secrets:07-get-secret-value
  ```

### <a name="deploy-apps-in-k8s-cluster">⭐ Deploy Apps in K8s Cluster</a>

**1 -** Deploy all app services to GKE cluster

**🚨 Important Note**: 

> Please update all secret values palceholder to your own secret values in `Secret.yaml` files of those `k8s-resource-defins` folders before starting this step.

- **🚨 Important Step**: Set up **🐳 Docker Hub and build app container images & upload them to Docker Hub** by following the steps in **⭐ Build App Container Images & Upload them to Docker Hub** subsection, **IF YOU DIDN'T FINISH** **⚙️ Run App in Kind Cluster Locally** section.

- Deploy **go backend app**

  ```bash
  task go-k8s-resource-defins:apply
  ```

- Deploy **node backend app**

  ```bash
  task node-k8s-resource-defins:apply
  ```

- Deploy **python backend app**

  ```bash
  task python-k8s-resource-defins:apply
  ```

- Deploy **frontend app**

  ```bash
  task frontend-k8s-resource-defins:apply
  ```

- **Check pods and services** in `ai-tools` namespace after deploying all app services

  ```bash
  kubectl get pods -n ai-tools

  kubectl get svc
  ```

- 🎉 Now, You can access your app with the `EXTERNAL-IP` (eg. `http://172.18.0.2/`) of **Traefik LoadBalancer** by running:

  ```bash
  kubectl get all -n traefik

  OR

  kubectl get svc -n traefik
  ```

- **🚨 Important Step**: Set up **Authorization for running app in GKE Cluster** by following the steps in **⭐ Set up GCP services authorization for app** subsection.

- **🚨 Important Step**: Set up **Domain and HTTPS (SSL/TLS)** by **buying a domain from some domain providers** (eg. `Namecheap`, `GoDaddy`, `Squarespace`) first, and then easily **creating a DNS record** and setting up `SSL/TLS` to use `Flexiable encription mode` in **CloudFlare**.

- 🎉 Now, You can access your app via `https` (eg. `https://yourDomainName`) in browser.

**2 - 📌 Useful kubectl CLIs for debug**:
  - Print the logs of pod
  - Show the details of pod. You can view the liveness, Readiness and all conditions of pod

  - Show all services in namespace
  - Show all pods in namespace
  - Show all deployments in namespace
  - Show all replicasets in namespace
  - Show all resources in namespace

  ```bash
  kubectl logs -n ai-tools <pod-name>
  kubectl describe pod -n ai-tools <pod-name>

  kubectl get svc -n ai-tools
  kubectl get pods -n ai-tools
  kubectl get deployment -n ai-tools
  kubectl get replicaset -n ai-tools
  kubectl get all -n ai-tools
  ```

**3 - 🚨🚨💸💸 Clean up to aviod cost 💸💸🚨🚨**

Remember to **remove the cluster** after you **finish testing or development** because a running cluster with K8s resource **charges you by running time**. You can use **new GCP user 300$ free credit to cover the fee for first 3 months if you are new GCP user**, but you will need to **💸 PAY 💸** after 3 months.

**Delete the GCP network, subnet, firewall rules, and cluster** that we just created by running:

```bash
task gcp:09-clean-up
```

## <a name="deploy-app-on-staging-and-pro">🏗️☸️ GKE (GCP): Deploy app on 🛠️Staging and 🚀Prod Environments</a>

**🚨 Important Note**:

> Please make sure to update the K8s cluster `context` both for **Staging** and **Production** envs in `.kluctl.yaml` file to your own clusters first.
>
> Please make sure to update the `hostName` in `production.yaml` and `staging.yaml` files of `config` folder of `kluctl` folder to your own host name.
>
> If you don't want to set up a domain name for the app, you need to remove all the usages of 👉 **Host(`{{ sharedVars.hostName }}`)** 👈 in all `IngressRoute.yaml` files of `kluctl` folder. This makes sure Load Balancer use correct `IngressRoute` to route the incoming traffic.
>
> The current `kluctl` folder does not include `External Secret` deployment yet, and the service deployments are all using local `Secret` resource files to generate K8s sceret. So, you should deploy `External Secret` manually first if you need to use `External Secret` in services.

### <a name="deploy-app-on-staging-env">⭐ Deploy App on Staging Environment</a>

**1 -** Create a **seperate new cluster** for deploying app to `Staging` environment **IF YOU ONLY have 1 cluster** running for deploying `Production` environment.

**🚨 Important Note**:

> Change the cluster name of `gcp:06-create-cluster` task CLI to `ai-tools-staging` in `Taskfile.yaml` first if you alreay created a `ai-tools` cluster.

- Create a **Standard** GKE cluster with `e2-standard-2` machine type and 2 worker nodes (VMs) for `Staging` environment.

  ```bash
  task gcp:06-create-cluster
  ```

- View all existing clusters and **Switch to `Staging` cluster**
  - 1st CLI is to view all existing created cluster
  - 2nd CLI is to switch cluster
  - Remember replace `<custer-context-name>` placeholder to real `Staging` cluster context name

  ```bash
  kubectx

  kubectx <custer-context-name>
  ```

- Update the K8s cluster `context` both for **Staging** and **Production** envs in `.kluctl.yaml` file of `kluctl` folder to your own `Staging` and `Production` clusters.

**2 - Deploy app to Staging** environment cluster

- Verify the **yaml files** after rendering with template of `staging` env

  ```bash
  task kluctl:render-staging
  ```

- **Deploy all K8s resources** defined in `kluctl` folder for `staging` env

  ```bash
  task kluctl:deploy-staging
  ```

### <a name="error-solution-after-app-deployment">⭐ Error & Solution after App Deployment</a>

**🚨 Important Error**:

You are very likely seeing this `no matches for kind "IngressRoute" in version "traefik.containo.us/v1alpha1"` error. The app is actully running correctly now because the `IngressRoute` were all created. You can check all created `IngressRoute` by running:

```bash
kubectl get ingressroutes -A
```

**💡 Reason of Error**:

If `kluctl deploy` applies the **Traefik CRDs** and **app resources** (like `IngressRoute`) in the **same deploy run**, and the **CRDs take a few seconds to become available/registered in the API server**, then any resources that use those CRDs (like `IngressRoute`) might fail with this error.

- Kubernetes **doesn't apply resources in dependency order** unless you explicitly control it.
- Even if you apply the **CRDs** first (in the same deploy), Kubernetes may still be registering the CRD with the API server when `Kluctl` moves on to the `IngressRoute` manifest.
- So, the resource fails because Kubernetes doesn’t recognize the new kind yet.

**✅ Solution of Error**:

For safer option, you can still fix it easily by **redeploying the app with running same CLI again**.

- After you redeploy the app, this **error won't show again** because the **CRDs** including `IngressRoute` **already registered** in K8s API server in first deployment, and the new type CRD, `IngressRoute`, becomes `"known"` to the API server.
- So, the 2nd deployment will **succeed without error** when applying `IngressRoute` resources in app.

### <a name="set-up-gcp-authorization-domain-https-for-staging-env">⭐ Set up GCP Authorization, Domain and HTTPS for Staging Env</a>

- 🎉 Now, You can access your `staging` app with the `EXTERNAL-IP` (eg. `http://172.18.0.2/`) of **Traefik LoadBalancer** after resolving the app deployment error:

  ```bash
  kubectl get all -n traefik

  OR

  kubectl get svc -n traefik
  ```

- **🚨 Important Step**: Set up **Authorization for running app in GKE Cluster** by following the steps in **⭐ Set up GCP services authorization for app** subsection.

- **🚨 Important Step**: Set up **Domain and HTTPS (SSL/TLS)** by **buying a domain from some domain providers** (eg. `Namecheap`, `GoDaddy`, `Squarespace`) first, and then easily **creating a DNS record** and setting up `SSL/TLS` to use `Flexiable encription mode` in **CloudFlare**.

- 🎉 Now, You can access your `staging` app via `https` (eg. `https://yourDomainName`) in browser.

### <a name="deploy-app-on-production-env">⭐ Deploy App on Production Environment</a>

**1 - Deploy app to Production** environment cluster

- View all existing clusters and **Switch to `Production` cluster**
  - 1st CLI is to view all existing created cluster
  - 2nd CLI is to switch cluster
  - Remember replace `<custer-context-name>` placeholder to real `Production` cluster context name

  ```bash
  kubectx

  kubectx <custer-context-name>
  ```

- Verify the **yaml files** after rendering with template of `production` env

  ```bash
  task kluctl:render-production
  ```

- **Deploy all K8s resources** defined in `"kluctl"` folder for `production` env

  ```bash
  task kluctl:deploy-production
  ```

- Follow the same steps in **⭐ Error & Solution after App Deployment** subsection to resolve the deployment error in **Production environment cluster**

**2 -** Set up GCP Authorization, Domain and HTTPS for **Production environment cluster**

- 🎉 Now, You can access your `production` app with the `EXTERNAL-IP` (eg. `http://172.18.0.2/`) of **Traefik LoadBalancer** after resolving the app deployment error:

  ```bash
  kubectl get all -n traefik

  OR

  kubectl get svc -n traefik
  ```

- **🚨 Important Step**: Set up **Authorization for running app in GKE Cluster** by following the steps in **⭐ Set up GCP services authorization for app** subsection.

- **🚨 Important Step**: Set up **Domain and HTTPS (SSL/TLS)** by **buying a domain from some domain providers** (eg. `Namecheap`, `GoDaddy`, `Squarespace`) first, and then easily **creating a DNS record** and setting up `SSL/TLS` to use `Flexiable encription mode` in **CloudFlare**.

- 🎉 Now, You can access your `production` app via `https` (eg. `https://yourDomainName`) in browser.

**3 - 🚨🚨💸💸 Clean up to aviod cost 💸💸🚨🚨**

Remember to **remove ALL clusters** after you **finish testing or development** because the running clusters with K8s resource **charges you by running time**. You can use **new GCP user 300$ free credit to cover the fee for first 3 months if you are new GCP user**, but you will need to **💸 PAY 💸** after 3 months.

- Only Delete the **entire staging cluster** by running

  ```bash
  gcloud container clusters delete ai-tools-staging --zone us-central1-a
  ```

- OR only delete the **K8s resources in staging cluster**, but still **keeping the running staging cluster** by running

  ```bash
  task kluctl:delete-staging
  ```

- Delete **everything** including the GCP network, subnet, firewall rules, and **ONLY Production cluster** by running:

> **🚨 Important Note**: This task CLi **ONLY delete `ai-tools` Production cluster**, so you have to update this task CLI to include a CLI for deleting **Staging cluster**.

  ```bash
  task gcp:09-clean-up
  ```

## <a name="deploy-app-with-ci-cd-in-cluster">🔁☸️ GKE (GCP): Deploy App with CI&CD in K8s Cluster</a>

We will use `GitHub actions` for **Continuous Integrataion (CI)** and `Kluctl GitOps` for **Continuous Deployment (CD)**.

> **📌 Note**: The concept of `GitOps` is to have a **controller** running in K8s cluster. The controller is able to **automatically pull updates from Git**, which can be triggered via a webhook. This keep those updates in sync with the deployed state of cluster.

**🚨Important Step**: 

The previous **🏗️☸️ GKE (GCP): Deploy app on 🛠️Staging and 🚀Prod Environments** section is required to be finished first before starting this section, **IF YOU DIDN'T FINISH** this previous section yet.

### <a name="set-up-ci">⭐ Set up Continuous Integrataion (CI)</a>

**1 -** Add necessary **secrets** to you **GitHub repo**, which allow **GitHub workflow** to use

- Go to your **GitHub repository of this project**
- Click **Settings → Secrets and variables → Actions** button
- Click **New repository secret** button
- Add `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, and `MY_GITHUB_ACTION_PAT` secrets.

**2 -** Verify the **Continuous Integrataion** process

**🚨 Important Note**:

> You need to **uncomment out** 2 lines `main branches` code in `image-ci.yml` file (`image-ci-docker-vm.yml` file is for **GCE VM with Docker**) first in order to trigger a **Git Action workflow for your frontend code change**
>
>  ```bash
>  # branches:
>  #   - "main"
>  ```

- **Update any code** in `frontend` folder.
- **Commit and push** the code change to remote main branch.
- Check if the code push action **triggers a workflow** in the `Actions` tab of your **GitHub repository**. 
- Also, it will **create a new PR** including the image tag version change for **ONLY Staging enviroment**.

**🚨 Important Note**:

> The GitHub workflow would also update the `new image tag` for **Production environment in the new PR ONLY IF** a **new released tag** matching **0.0.0** format is **pushlised** in **GitHub Repo**. You can test this by trying to publish a tag in your GitHub Repo.

### <a name="deploy-app-with-gitops-in-staging">⭐ Deploy App with GitOps in Staging Cluster</a>

**1 -** Clean up K8s resources in `Staging` and `Production` clusters

We should **delete all K8s resources** in clusters to get 2 fresh `Staging` and `Production` clusters first **because we already manually deployed app** into these 2 cluster in the previous **🏗️☸️ GKE (GCP): Deploy app on 🛠️Staging and 🚀Prod Environments** section.

- **ONLY** delete the **K8s resources in cluster**, but still **keeping the cluster** by running

  ```bash
  task kluctl:delete-staging
  ```

  ```bash
  task kluctl:delete-production
  ```

- **OR** Delete the **entire cluster** and re-create a new one by running

  > **🚨 Important Note**: Make sure the cluster name of `gcp:06-create-cluster` task CLI is `ai-tools-staging` in `Taskfile.yaml` file of `project` folder **when creating cluster for `Staging` environment**.

  ```bash
  gcloud container clusters delete ai-tools-staging --zone us-central1-a

  task gcp:06-create-cluster
  ```

  ```bash
  gcloud container clusters delete ai-tools --zone us-central1-a

  task gcp:06-create-cluster
  ```

**2 -** Use `Kluctl GitOps` to deploy app in `Staging` cluster.

- **🚨 Important Step**: Set up **🐳 Docker Hub and build app container images & upload them to Docker Hub** by following the steps in **⭐ Build App Container Images & Upload them to Docker Hub** subsection, **IF YOU DIDN'T FINISH** **⚙️ Run App in Kind Cluster Locally** section.

- Deploy app in **Staing cluster** by deploying `Kluctl GitOps` into the **fresh `Staing` cluster**.

  ```bash
  task cicd:kluctl-gitops:deploy-app-with-gitops-to-staging-cluster
  ```

- View **all kluctl deployments** across all namespaces and all pods including **kluctl controller and kluctl webui** in `kluctl-system` namespaces,

  ```bash
  kubectl get kluctldeployments.gitops.kluctl.io -A
  
  kubectl get pods -n kluctl-system
  ```

- View **random password** (eg. `g9vqztq5rd7d2rxtqs29xsz7rw4vxbrl`) of `kluctl webui` and copy the password value manually

  ```bash
  task cicd:kluctl-gitops:get-webui-password
  ```

- **Port forward** `kluctl webui` to `localhost 8080 port`

  ```bash
  task cicd:kluctl-gitops:port-forward-webui
  ```

### <a name="error-solution-after-app-deployment-with-gitops">⭐ Error & Solution after App Deployment with GitOps in Staging Cluster</a>

Go to `kluctl web ui page` (`http://localhost:8080/`) and log in with `admin` username and the `random password` we just copied to **view deployment status**.

**🚨 Important Error**:

You are very likely seeing this `no matches for kind "IngressRoute" in version "traefik.containo.us/v1alpha1"` error. The app is actully running correctly now because the `IngressRoute` were all created. You can check all created `IngressRoute` by running:

```bash
kubectl get ingressroutes -A
```

**💡 Reason of Error**:

If `kluctl deploy` applies the **Traefik CRDs** and **app resources** (like `IngressRoute`) in the **same deploy run**, and the **CRDs take a few seconds to become available/registered in the API server**, then any resources that use those CRDs (like `IngressRoute`) might fail with this error.

- Kubernetes **doesn't apply resources in dependency order** unless you explicitly control it.
- Even if you apply the **CRDs** first (in the same deploy), Kubernetes may still be registering the CRD with the API server when `Kluctl` moves on to the `IngressRoute` manifest.
- So, the resource fails because Kubernetes doesn’t recognize the new kind yet.

**✅ Solution of Error**:

For safer option, you can still fix it easily by clicking the **kebab menu button** of `ai-tools(staing)` card and clicking **🚀 Deploy** button to re-deploy the app from `kluctl web ui page` to fix the error or warning.

- After you redeploy the app, this **error won't show again** because the **CRDs** including `IngressRoute` **already registered** in K8s API server in first deployment, and the new type CRD, `IngressRoute`, becomes `"known"` to the API server.
- So, the 2nd deployment will **succeed without error** when applying `IngressRoute` resources in app.

### <a name="set-up-gcp-authorization-domain-https-for-staging-env-gitOps">⭐ Set up GCP Authorization, Domain and HTTPS for Staging Cluster with GitOps</a>

- 🎉 Now, You can access your `staging` app with the `EXTERNAL-IP` (eg. `http://172.18.0.2/`) of **Traefik LoadBalancer** after resolving the app deployment error:

  ```bash
  kubectl get all -n traefik

  OR

  kubectl get svc -n traefik
  ```

- **🚨 Important Step**: Set up **Authorization for running app in GKE Cluster** by following the steps in **⭐ Set up GCP services authorization for app** subsection.

  > **📌 Note**: IF you **already have a GSA** for this app with required GCP services access, you only need to **run these 2 CLIs** to **bind default KSA in namespace with GSA** and **annotate default KSA in namespace with GSA**. 
  >
  > Otherwise, you need to go through all steps in **⭐ Set up GCP services authorization for app** subsection.
  >
  > ```bash
  > task general:02-bind-KSA-with-GSA
  >
  > task general:03-annotate-KSA-with-GSA
  > ```

- **🚨 Important Step**: Set up **Domain and HTTPS (SSL/TLS)** by **buying a domain from some domain providers** (eg. `Namecheap`, `GoDaddy`, `Squarespace`) first, and then easily **creating a DNS record** and setting up `SSL/TLS` to use `Flexiable encription mode` in **CloudFlare**.

- 🎉 Now, You can access your `staging` app via `https` (eg. `https://yourDomainName`) in browser.

### <a name="deploy-app-with-gitops-in-production">⭐ Deploy App with GitOps in Production Cluster</a>

**1 - Deploy app to Production** environment cluster

- View all existing clusters and **Switch to `Production` cluster**
  - 1st CLI is to view all existing created cluster
  - 2nd CLI is to switch cluster
  - Remember replace `<custer-context-name>` placeholder to real `Production` cluster context name

  ```bash
  kubectx

  kubectx <custer-context-name>
  ```

- Follow the **same steps** in the previous subsections of **Staging Cluster** to deploy the app with `GitOps` into **Production cluster**.

**2 - Verify CI&CD proceess** for `Staging` and `Production` Clusters

  > **📌 Note**: For some cases, you can **ONLY** see the `Reconciliation State` time of application is updated in `kluctl web ui`, **but there are NO** new pods created in **K8s Cluster** because K8s **did not find out any changes of existing deployments**, so it **skip** creating new pods.

- Now, the `Kluctl deployment` will **watch the Git Repo** and check for **any new Git commits pushed to GitHub** and re-run the **re-deployment every 5 minutes**. 
- The re-deployment would still start even if the commits change does not include the files in `kluctl` folder that is used by **kluctl deployment to render and apply resources**.
- **Verifying auto-deployment for `Staging` Cluster**: 
  - **Push a new commit** to GitHub by editing any `frontend UI text`.
  - Check if the code push action **triggers a workflow** in the `Actions` tab of your **GitHub repository**. 
  - **Merge the auto-created PR** to update the new image tags for `Staging` cluster.
  - Check if there are **new K8s pods created** in `Staging` K8s cluster or a deployment process started in `kluctl web ui`.
- **Verifying auto-deployment for `Production` Cluster**:
  - Publish a **new released tag** matching `0.0.0` format in **GitHub Repo**.
  - **Merge the auto-created PR** to update the new image tags for `Staging` and `Production` clusters.
  - Check if there are **new K8s pods created** in `Staging` and `Production` K8s clusters or a deployment process started in `kluctl web ui`.

**3 - 🚨🚨💸💸 Clean up to aviod cost 💸💸🚨🚨**

Remember to **remove ALL clusters** after you **finish testing or development** because the running clusters with K8s resource **charges you by running time**. You can use **new GCP user 300$ free credit to cover the fee for first 3 months if you are new GCP user**, but you will need to **💸 PAY 💸** after 3 months.

- Only Delete the **entire staging cluster** by running

  ```bash
  gcloud container clusters delete ai-tools-staging --zone us-central1-a
  ```

- OR only delete the **K8s resources in staging cluster**, but still **keeping the running staging cluster** by running

  ```bash
  task kluctl:delete-staging
  ```

- Delete **everything** including the GCP network, subnet, firewall rules, and **ONLY Production cluster** by running:

> **🚨 Important Note**: This task CLi **ONLY delete `ai-tools` Production cluster**, so you have to update this task CLI to include a CLI for deleting **Staging cluster**.

  ```bash
  task gcp:09-clean-up
  ```

## <a name="set-up-ci-cd-in-docker">🔁🐳 GCE(GCP) VM: Set up CI&CD for App Deployment in Docker</a>

**🚨Important Step**: 

The **☁️🐳 GCE(GCP) VM: Deploy App with Docker Compose 🐳** section or **☁️🐳🐳 GCE(GCP) VM: Deploy App with 🐳🐳 Docker Swarm 🐳🐳** section is required to be finished first before starting this section, **IF YOU DIDN'T FINISH** 1 of these section yet.

- Follow the same steps in **⭐ Set up Continuous Integrataion (CI)** subsection to set up **CI** for

- Connect to GCP VM

- For **CD step**, deploying `Watchtower` in GCP VM to auto-redeploy containers when new container images are found from Docker Hub by running

  - Check every 30 seconds

  - Pull any new images with `developing` tag from Docker Hub

  - Restart the container with the new image

  - Remove the old image (--cleanup)

```
docker run -d \
  --name watchtower \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 30 \
  --cleanup
```

- **Verifying auto-deployment for GCP VM**, you can push a new commit to GitHub by editing any `frontend UI text` and check auto-deployment by
  - Viewing the the change in app web page
  - Running the `docker logs -f watchtower` cli to view the `Watchtower` log for new deployments

TODO: Test it

2. 🚨 Important: Make sure thee `Watchtower` container would auto-restart After **VM reboots and Docker daemon restarts**

## <a name="run-app-in-kind">⚙️ Run App in Kind Cluster Locally</a>

**Develop app in `Kind` cluster locally** is esay way to find out any issue in K8s during development process

### <a name="build-app-container-image-and-push">⭐ Build App Container Images & Upload them to Docker Hub</a>

Build **container images of app services** and **upload to Docker hub**, so that we can **deploy** them in `Kind` cluster that we are going to create.

- Switch to `devbox` project isolated environment

  ```bash
  devbox shell
  ```

- Open `Docker Desktop` app manually

- Set up **Docker buildx** used to **build container image for multiple architecture** and **Login Docker for pushing images to Docker hub** by running:

  ```bash
  task bootstrap-buildx-builder

  docker login
  ```

- Build container images and push them to Docker hub for `go-backend` serivce

  ```bash
  task go-backend:build-container-image-multi-arch
  ```

- Build container images and push them to Docker hub for `node-backend` serivce

  ```bash
  task node-backend:build-container-image-multi-arch
  ```

- Build container images and push them to Docker hub for `python-backend` serivce

  ```bash
  task python-backend:build-container-image-multi-arch
  ```

- Build container images and push them to Docker hub for `frontend` serivce

  > **⚠️ Warning Note**: You should update `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_VAPI_PUBLIC_KEY` environment variable values in the `build-container-image-multi-arch` task CLI of `Taskfile.yaml` file of `frontend` folder to your own secret values from **Clerk and Vapi**

  ```bash
  task frontend:build-container-image-multi-arch
  ```

### <a name="deploy-app-in-kind-cluster">⭐ Deploy App in Kind Cluster</a>

**1 -** Create a `Kind` cluster **locally**

- Generate `kind-config.yaml` file based on you file absolute path and create `Kind` cluster that is **actually Docker containers in Docker Desktop VM locally**

  ```bash
  task kind:01-generate-config

  task kind:02-create-cluster
  ```

- Verify your kind cluster

  ```bash
  kubectx
  ```

- Verify your nodes and system pods in kind cluster

  ```bash
  kubectl get nodes

  kubectl get pods -A
  ```

- Enable **Load Balancer service** in **Local Kind Cluster** by opening a **2nd project terminal** in proejct and running

  > Remember **switch back to 1st terminal** and **leave 2nd terminal running** in the background

  ```bash
  devbox shell

  task kind:03-run-cloud-provider-kind
  ```

**2 -** Create **namespace and deploy Traefik ingress controller** in `Kind` Cluster locally

- Make sure you are currently using `Kind` cluster by running

  > If `Kind` cluster is not selected in K8s cluster context, you can run `kubectx <custer-context-name>` CLI to switch K8s cluster.

  ```bash
  kubectx
  ```

- Create **namespace**

  ```bash
  task common:apply-namespace
  ```

- Deploy **Traefik ingress controller** in Local Kind cluster with **Load Balancer serivce**

  > **📌 Note**:
  > The Load Balancer serivce is running in **2nd project terminal** now.
  >
  > **IF YOUR RUN IT IN GKE of GCP**, It will provision a **REAL** Load Balancer with an ExternalIP assigned by Traefik default setting. This will cause **Load Balancer and ExternalIP fee 💸💸**.
  >
  > However, it **won't provision** a real Load Balancer and an ExternalIP for **local Kind cluster** case, so you **won't be charged** for this case.

  ```
  task common:deploy-traefik
  ```

- Verify all **resources in traefik namespace** 

  > **📌 Note**: the ExternalIP of LoadBalancer will stay `pending` forever if you don't run CLI, `task kind:03-run-cloud-provider-kind`, to **run the Load Balancer in the background and enable ExternalIP** for Local Kind Cluster in **2nd project terminal**.

  ```bash
  kubectl get all -n traefik
  ```

- Apply the **Traefik middleware to strip path prefix** for all incoming requests by ingress controller

  ```bash
  task common:apply-traefik-middleware
  ```

**3 - Deploy all app services in Kind Cluster locally** by using K8s resource definition that are using container images

- Deploy `go backend` app in Local Kind cluster

  ```bash
  task go-k8s-resource-defins:apply
  ```

- Deploy `node backend` app in Local Kind cluster

  ```bash
  task node-k8s-resource-defins:apply
  ```

- Deploy `python backend` app in Local Kind cluster

  ```bash
  task python-k8s-resource-defins:apply
  ```

- Deploy `frontend` app in Local Kind cluster

  ```bash
  task frontend-k8s-resource-defins:apply
  ```

- Verify pods and services in `ai-tools` namespace after deploying all app services

  ```bash
  kubectl get pods -n ai-tools

  kubectl get svc
  ```

- 🎉 Now, You can access your app **LOCALLY** with the `EXTERNAL-IP` (eg. `http://172.18.0.2/`) of **Traefik LoadBalancer** by running:

  ```bash
  kubectl get all -n traefik

  OR

  kubectl get svc -n traefik
  ```

- **🚨 Important Step**: Set up **Authorization for running app in local machine** by following the steps in **⭐ Set up GCP services authorization for app** subsection.

**4 - 📌 Useful kubectl CLIs for debug**:

- Print the logs of pod
- Show the details of pod. You can view the liveness, Readiness and all conditions of pod

- Show all services in namespace
- Show all pods in namespace
- Show all deployments in namespace
- Show all replicasets in namespace
- Show all resources in namespace

```bash
kubectl logs -n ai-tools <pod-name>
kubectl describe pod -n ai-tools <pod-name>

kubectl get svc -n ai-tools
kubectl get pods -n ai-tools
kubectl get deployment -n ai-tools
kubectl get replicaset -n ai-tools
kubectl get all -n ai-tools
```

## <a name="develop-app-locally-kind-tilt">🛠️ Develop App Locally with Kind & Tilt</a>

Deploy apps by using `Tilt` to better **detact file changes and auto rebuild and push images to enable these changes in local cluster** envrioment as quickly as possbile.

Use `Tilt`, we can **develop against a K8s config that will match as close as possbile to what we are going to run in production**, which will allow us to **identify and debug issues** that live not only at application layer but also at **K8s layer or maybe in ingress controller**.

**🚨Important Step**: 

The previous **⚙️ Run App in Kind Cluster Locally** section is required to be finished first before starting this section, **IF YOU DIDN'T FINISH** this previous section yet.

**1 -** Make sure app **is running** in local `Kind` cluster now

**2 -** Run `Tilt` and access Tilt page (`http://localhost:10350/`)

```bash
task tilt-up
```

**3 -** Set up **Sync live update** for all langauages (**Go, Node.js, Python**) by following those **2 Tilt guide pages** (`https://docs.tilt.dev/tutorial/5-live-update.html` and `https://docs.tilt.dev/example_go.html`)

**4 -** Work on your code, save files and the change will auto applied

## <a name="about-the-author">👨‍💼 About the Author</a>

Hi! I'm **Evan Huang — a full-stack software developer with 4+ years of experience** in web applications, real-time systems, and cloud integration. I’m passionate about building scalable products with clean architecture, elegant UI/UX, and modern technologies like **Google Cloud Platform, React, Node.js, Go, Python and different AI technologies**.

This **AI Tools Studio app** project was completed on **August 8, 2025**, and reflects my focus on full stack development, cloud infrastructure, and responsive design into real-world solutions.

Feel free to connect with me in LinkedIn or GitHub!

<a href="https://www.linkedin.com/in/evan-huang-97336b1a9/" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926619/Screenshot_2025-06-02_at_22.40.32_mxzsbh.png" alt="LinkedIn" width="150" />
</a>
<br/>
<a href="https://github.com/EvanHuang7" target="_blank">
  <img src="https://res.cloudinary.com/dapo3wc6o/image/upload/v1748926611/Screenshot_2025-06-02_at_22.52.45_jtlfww.png" alt="GitHub" width="150" />
</a>
