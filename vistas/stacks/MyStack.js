import { Api, RDS, Auth, Function } from "@serverless-stack/resources";
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { aws_rds as rds } from 'aws-cdk-lib';
import * as msk from '@aws-cdk/aws-msk-alpha'
import { aws_msk } from 'aws-cdk-lib';
import { ManagedKafkaEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StartingPosition } from 'aws-cdk-lib/aws-lambda'


export function MyStack({ stack }) {

  const DATABASE = "mydb";
  //const TOPIC="testing"


  ///////////////////////
  //  NETWORKING: VPC + SECURITY GROUP 
  ///////////////////////

  const vpc = new ec2.Vpc(stack, 'testVPC', {
    cidr: '10.0.0.0/20',
    natGateways: 0,
    maxAzs: 2,
    enableDnsHostnames: true,
    enableDnsSupport: true,
    subnetConfiguration: [
      {
        cidrMask: 22,
        name: 'private',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    ],
  })

  //////////////////////// ALTERNATIVELY IMPORT AN EXISTING VPC (in this case the default one)

  /* const vpc = ec2.Vpc.fromLookup(stack, 'VPC',{
    isDefault: true,
  }); */
  
  const privateSg = new ec2.SecurityGroup(stack, 'private-sg', {
    vpc,
    securityGroupName: 'private-sg',
  })

  privateSg.addIngressRule(
    privateSg,
    ec2.Port.allTraffic(),
    'allow internal SG access'
  )

  ///////////////////////
  //  RDS: CLUSTER + RDS SUBNET GROUP + SECRET MANAGER ENDPOINT
  ///////////////////////
  
  const subnetGroup = new rds.SubnetGroup(stack, 'rds-subnet-group', {
    vpc,
    subnetGroupName: 'aurora-subnet-group',
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    description: 'An all private subnets group for the DB',
  })

  const clusterRDS = new RDS(stack, "Cluster", {
    engine: "postgresql10.14",
    defaultDatabaseName: DATABASE,
    cdk: {
      cluster: {   
        vpc,
        subnetGroup,
        securityGroups: [privateSg],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    }
  });

  new ec2.InterfaceVpcEndpoint(stack, 'secrets-manager', {
    service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    vpc,
    privateDnsEnabled: true,
    subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    securityGroups: [privateSg],
  })

  // UNCOMMENT the next block to create MSK + Kafka consumer (Lambda function)

  /*

  ///////////////////////
  //  MSK: CLUSTER + STS ENDPOINT + LAMBDA ENDPOINT
  ///////////////////////

  const  clusterMSK = new msk.Cluster(stack, 'msk-cluster', {
    kafkaVersion: msk.KafkaVersion.V2_8_1,
    clusterName: 'kafka-cluster',
    //instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),

    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED }, 
    securityGroups: [privateSg],
    removalPolicy: cdk.RemovalPolicy.DESTROY, 

  })

  // 17-08-2022 MSK Serverless support added to Cloudformation:

    // const mskServerlessCluster = new aws_msk.CfnServerlessCluster(stack, 'MyCfnServerlessCluster', {
    //   clientAuthentication: {
    //     sasl: {
    //       iam: {
    //         enabled: true,
    //       },
    //     },
    //   },
    //   clusterName: 'MSKserverless',
    //   vpcConfigs: [{
    //     subnetIds: VPC.selectSubnets({subnetType: ec2.SubnetType.PRIVATE_ISOLATED}).subnetIds,
    //     securityGroups: [SecurityGroup.securityGroupId],
    //   }],
    // });


  // In order to use MSK as Lambda Function trigger we need to add some VPC endpoints (or a NAT to allow MSK call the function)

  new ec2.InterfaceVpcEndpoint(stack, 'sts', {
    service: ec2.InterfaceVpcEndpointAwsService.STS,
    vpc,
    privateDnsEnabled: true,
    subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED }, 
    securityGroups: [privateSg],
  })

  new ec2.InterfaceVpcEndpoint(stack, 'lambda', {
    service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
    vpc,
    privateDnsEnabled: true,
    subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED }, 
    securityGroups: [privateSg],
  })
  

  ///////////////////////
  //  KAFKA CONSUMER: LAMBDA FUNCTION + TRIGGER + ROLE 
  ///////////////////////
  
  const myRole = new iam.Role(stack, 'My Role', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaMSKExecutionRole"),

      // we also pass the basic permissions 
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"),
      iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
    ]
    //if MSK serverless the function also needs kafka:DescribeClusterV2
      
  }); 

  const msk_consumer = new Function(stack, "Consumer", {
    handler: "src/msk/consumer/index.handler",
    //environment: {
    //  TOPIC,
    //},

    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED }, //if we have only private subnets, not sure if needed
    securityGroups: [privateSg],
    role: myRole,
  });

  msk_consumer.addEventSource(new ManagedKafkaEventSource({
    clusterArn: clusterMSK.clusterArn,
    topic: TOPIC,   // this does not rise an error in the creation with uncreated topics (option: create topic in the producer function, then consumer triggers automatically update status to OK)
    batchSize: 100, // default
    startingPosition: StartingPosition.TRIM_HORIZON,
  }));

  */

  ///////////////////////
  //  MAIN: COGNITO USER POOL + (API GW + LAMBDA FUNCTION)
  ///////////////////////

  // Create User Pool

  const auth = new Auth(stack, "Auth", {
        login: ["email"],
        cdk:{
            userPoolClient:{
                authFlows: {userPassword: true,}    //"ALLOW_USER_PASSWORD_AUTH"
            }
        }
    }); 

  const api = new Api(stack, "Api", {
    authorizers: {
      Authorizer: {
        type: "jwt",
        jwt: {
          issuer: "https://cognito-idp.${this.region}.amazonaws.com/${auth.userPoolId}",
          audience: "[auth.userPoolClientId]"
        },
      },
    }, 
    defaults: {
      authorizer: "Authorizer",
      function: {
        environment: {
          DATABASE,
          //BROKERS:clusterMSK.bootstrapBrokersTls,   //WARNING: serverless MSK cluster has not got this property
          //TOPIC,
          CLUSTER_ARN: clusterRDS.clusterArn,
          SECRET_ARN: clusterRDS.secretArn,
        },
        permissions: [clusterRDS],
        vpc: vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        securityGroups: [privateSg],

        bundle: {
          nodeModules: ['@prisma/client','prisma', 'nexus', 'graphql'],
          copyFiles: [{ from: "prisma/schema.prisma" },
                      { from: "src/generated/client"}
        ]
        },
      },
    },
    routes: {
      "POST /": "src/server.graphqlHandler",
    },
  });


  ///////////////////////
  //  OUTPUT
  ///////////////////////

  stack.addOutputs({
    api: api.url,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });
  }

