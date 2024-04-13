import client from "../services/aws-sdk-route53.js";
import {
  ChangeResourceRecordSetsCommand,
  ListResourceRecordSetsCommand,
} from "@aws-sdk/client-route-53";
import { HostedZoneId, defaultTTL } from "../config/config.js";
import { listExistingRecords } from "../utils/isRecordExist.js";


// ---------------CREATE group of dns record ( bulk data)

export const createMultiDNS = async (req, res) => {
  const dnsRecords = req.body; // in this body is an array of DNS records


  const { HostedZoneId } = req.query;
  console.log(HostedZoneId)


  // const  HostedZoneId = "Z05457762EU2V64E5HHCE";

  try {
    const changebatch = {
      Changes: dnsRecords.map((record) => ({
        Action: 'CREATE',
        ResourceRecordSet: {
          Name: record.Name,
          Type: record.Type,
          TTL: record.TTL || defaultTTL,
          ResourceRecords: record.ResourceRecords.map((value) => ({
            Value: value.Value, // Assuming the value is a string without spaces
          })),
        },
      })),
    };

    const parameters = {
      HostedZoneId,
      ChangeBatch: changebatch,
    };

    // Call Route 53 API to create DNS records
    const commands = new ChangeResourceRecordSetsCommand(parameters);
    const data = await client.send(commands);

    res.status(201).json({ message: 'DNS records created successfully', data });
  } catch (error) {
    console.error('Error creating DNS records:', error);
    res.status(500).json({ error: 'Error creating DNS records' });
  }

};


// ---------------GET all dns record
export const getAllDNS = async (req, res) => {
  try {
    const { HostedZoneId } = req.query;


    console.log(HostedZoneId, 'hosted zone from params');


    const parameters = {
      HostedZoneId,
    };

    const commands = new ListResourceRecordSetsCommand(parameters);
    const data = await client.send(commands);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving DNS records:', error);
    res.status(500).json({ error: 'Error retrieving DNS records' });
  }
};





export const updateDNS = async (req, res) => {

  const { records, HostedZoneId, TTL } = req.body;

  console.log(records);

  try {
    for (const record of records) {
      const existingDNS = await listExistingRecords(
        record.Name,
        record.Type
      );
      if (existingDNS.length > 0) {
        // if record exsit then update
        const updateParameters = {
          HostedZoneId,
          ChangeBatch: {
            Changes: [
              {
                Action: "UPSERT",
                ResourceRecordSet: {
                  Name: record.Name,
                  Type: record.Type,
                  TTL: record.TTL || TTL,
                  ResourceRecords: record.ResourceRecords,
                },
              },
            ],
          },
        };

        const updateComm = new ChangeResourceRecordSetsCommand(updateParameters);
        await client.send(updateComm);

        console.log("Record updated successfully:", record);
        console.log(
          "Record already exists. Updating record:",
          existingRecords[0]
        );
      } else {
        
        console.log(
          "now calling creating controller or funtion to create new record"
        );
        createOneDNSRecords(req, res);
        console.log("Creating new record:", record);
      }
    }
    res
      .status(201)
      .json({ message: "DNS records created/updated successfully" });
  } catch (error) {
    console.error("Error creating/updating DNS records:", error);
    res.status(500).json({ error: "Error creating/updating DNS records" });
  }
};


// -------------CREATE single dns record only
export const createOneDNS = async (req, res) => {
  const { Name, Type, TTL, ResourceRecords } = req.body;
  try {
    const parameters = {
      HostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: Name,
              Type: Type,
              TTL: TTL || defaultTTL,
              ResourceRecords: [{ Value: ResourceRecords[0].Value }],
            },
          },
        ],
      },
    };

    const commands = new ChangeResourceRecordSetsCommand(parameters); // Call Route 53 API to create DNS record
    const data = await client.send(commands);

    res.status(201).json({ message: 'DNS record created successfully', data });
  } catch (error) {
    console.error('Error creating DNS record:', error);
    res.status(500).json({ error: 'Error creating DNS record' });
  }
};




//  DELETE give records

export const deleteDNS = async (req, res) => {


  const { records, hostedZoneId } = req.body; 
  console.log("req.record", records)
  console.log("req.HostedZoneId", hostedZoneId)


  // const dnsRecords = req.body;
  try {
    for (const record of records) {
      const existingRecords = await listExistingRecords(
        record.Name,
        record.Type,
      );
      if (existingRecords.length > 0) {
        // Delete existing record
        const deleteParams = {
          HostedZoneId,
          ChangeBatch: {
            Changes: [
              {
                Action: 'DELETE',
                ResourceRecordSet: record,
              },
            ],
          },
        };

        const deleteCommand = new ChangeResourceRecordSetsCommand(deleteParams);
        await client.send(deleteCommand);

        console.log('Record deleted successfully:', record);
      } else {
        console.log('Record does not exist. Skipping deletion:', record);
      }
    }
    res.status(201).json({ message: 'DNS records deleted successfully' });
  } catch (error) {
    console.error('Error creating/updating/deleting DNS records:', error);
    res
      .status(500)
      .json({ error: 'Error creating/updating/deleting DNS records' });
  }
};
