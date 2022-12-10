# Typesense multi-node cluster stack

Two step install:

1. Create VPC Stack (vpc-template.yml)
2. Create Cluster Stack (cluster-template.yml)

Although this stack is made for Typesense specifically it can be repurposed easily as it features some common real life scenarios:

-   VPC stack with 3 public subnets & Internet Gateway
-   Cross-stack references (Output/Export/!ImportValue)
-   Use of CloudFormation metadata for parameter grouping
-   Use of CloudFormation custom resource (for API Key generation)
-   Security group allowing instances within the same VPC to communicate
-   Typesense service auto install & service daemon
-   SNS & Lambda working with SDK
-   Systems Manager document & run command
