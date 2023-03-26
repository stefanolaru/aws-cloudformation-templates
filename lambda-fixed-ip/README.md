# Fixed IP Lambda

This is a sample project that demonstrates how to use a Lambda function with a fixed IP address.

-   create a VPC with 2 subnets (public and private)
-   create an EC2 instance in the public subnet that will act as a NAT instance
-   attach an Elastic IP to the NAT instance
-   create a Lambda function in the private subnet
