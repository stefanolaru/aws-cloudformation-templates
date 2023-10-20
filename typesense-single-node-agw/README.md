# Typesense single-node Stack

Although this stack is made for Typesense specifically it can be repurposed easily as it features some common real life scenarios:

-   "self-healing" EC2 (ARM64) running Amazon Linux 2023 in AutoScaling Group
-   API Gateway route mapping to EC2 instance IP (can also work for Route53)
-   cfn-init & cfn-signal
-   run shell script on instance boot (/var/lib/cloud/scripts/per-boot)
-   keep instance accessible after stop without Elastic IP or Load Balancer - good for dev
-   UserData & AWS CLI
-   persistent auto mounting EBS storage + fortmat volume if no filesystem is present (newly created volumes)
-   software auto install from binary on instance creation
-   service creation & service daemon
-   auto install and configure CloudWatch Agent
