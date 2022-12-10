# Typesense single-node Stack

Although this stack is made for Typesense specifically it can be repurposed easily as it features some common real life scenarios:

-   "self-healing" EC2 (ARM64) instance (ALB + ASG)
-   persistent auto mounting EBS storage + fortmat volume if no filesystem is present (newly created volumes)
-   software auto install on instance creation
-   service creation & service daemon
