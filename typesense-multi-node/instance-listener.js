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
            res.AutoScalingGroups[0]
                ? selectInstances(res.AutoScalingGroups[0].Instances)
                : []
        )
        .catch((err) => {
            console.log(err);
        });

    // extract instance IDs
    const instanceIds = instances.map((x) => x.InstanceId),
        nodes = [],
        nodeStrings = [];

    // describe instances
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

    // send SSM Command
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

    console.log(nodes);
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
