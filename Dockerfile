# syntax=docker/dockerfile:1

FROM ubuntu

# Install Docker
RUN apt-get update -y && \
    apt-get install -y \
    ca-certificates \
    curl \
    gnupg 

RUN mkdir -m 0755 -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

RUN echo \
    "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update

RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install Node 
RUN cd ~ && \
    curl -sL https://deb.nodesource.com/setup_16.x -o /tmp/nodesource_setup.sh

RUN bash /tmp/nodesource_setup.sh

RUN apt install nodejs -y

RUN node -v

RUN npm i -g yarn

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn 

RUN yarn add @nestjs/cli

COPY . .

RUN usermod -aG docker ${USER}

RUN dockerd

RUN yarn dev:db

RUN npx prisma db push

RUN yarn build

CMD [ "yarn", "start" ]