# LAMP stack

Two step install:

1. Create VPC Stack (vpc-template.yml)

2. Create LAMP Stack (template.yml)

Note: the ASG will launch an EC2 instance with no setup other than IP allocation and EBS mounting. Setup a webserver per your requirements, create an AMI and use it in the template.

Resources & Concepts:

-   VPC with 4 subnets (2 public/2 private)
-   "self-healing" EC2 instance
-   MultiAZ RDS instance in private subnet
-   Automatically generate RDS DB password and store in SecretsManager
-   2 persistent EBS volumes (one for storing nginx config/certificats, the other for webroot folder)
