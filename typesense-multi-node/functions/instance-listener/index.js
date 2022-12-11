const AWS = require("aws-sdk"),
    autoscaling = new AWS.AutoScaling(),
    ec2 = new AWS.EC2(),
    ssm = new AWS.SSM();

exports.handler = async () => {
    // get instances
    const instances = await autoscaling
        .describeAutoScalingGroups({
            AutoScalingGroupNames: [process.env.AutoScalingGroupName],
        })
        .promise()
        .then((res) =>
            res.AutoScalingGroups[0] && res.AutoScalingGroups[0].Instances
                ? selectInstances(res.AutoScalingGroups[0].Instances)
                : []
        )
        .catch((err) => {
            console.log(err);
        });

    // stop early if less than 3 nodes
    if (!instances || instances.length < 3) return;

    // extract instance IDs
    const instanceIds = instances.map((x) => x.InstanceId),
        nodeStrings = [];

    // describe instances to extract private IPs
    await ec2
        .describeInstances({
            InstanceIds: instanceIds,
        })
        .promise()
        .then((res) => {
            res.Reservations.forEach((v) => {
                if (v.Instances[0]) {
                    nodeStrings.push(
                        v.Instances[0].PrivateIpAddress +
                            ":" +
                            process.env.TypesensePeeringPort +
                            ":" +
                            process.env.TypesenseApiPort
                    );
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });

    // send SSM Command to update nodes & restart service
    await ssm
        .sendCommand({
            DocumentName: process.env.DocumentName,
            InstanceIds: instanceIds,
            Parameters: {
                NodeList: [nodeStrings.join(",")],
            },
            TimeoutSeconds: 300,
        })
        .promise()
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });

    //
    console.log(nodeStrings.join(","));

    return nodeStrings.join(",");
};

// select all healthy & inservice instances of the ASG
const selectInstances = (instances) =>
    instances.filter(
        (instance) =>
            instance.HealthStatus == "Healthy" &&
            instance.LifecycleState == "InService"
    );
