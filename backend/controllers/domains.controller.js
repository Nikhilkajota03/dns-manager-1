import {
  DeleteHostedZoneCommand,
  ListHostedZonesCommand,
  CreateHostedZoneCommand,
} from '@aws-sdk/client-route-53';
import client from '../services/aws-sdk-route53.js';
import { isDomainExist } from '../utils/isDomainExist.js';

// GET all Domains or list hosted zones

export const listHostZone= async (req, res) => {
  try {
    const fetchZonesCommand = new ListHostedZonesCommand({});
    const { HostedZones } = await client.send(fetchZonesCommand);
    console.log('list of hosted zones or domains');
    res.status(200).json(HostedZones);
  } catch (error) {
    console.error('Error listing hosted zones:', error);
    throw error; // Rethrow the error for handling at a higher level
  }
};


//  DELETE give domain from hosted zone record
export const deleteZone = async (req, res) => {
  try {
    const domainsToDelete = req.body;
    
    const deletionResults = [];

    //deleteResults

    // Fetch existing hosted zones
    const existingHostedZones = await isDomainExist();

    for (const domain of domainsToDelete) {
      const { Name } = domain;
      console.log('Name === from fron or backend', Name);
      const foundZone = existingHostedZones.find(
        (zone) =>
          zone.Name.toLowerCase() == Name + '.'.toLowerCase() ||
          zone.Name.toLowerCase() == Name.toLowerCase(),
      );

      if (!foundZone) {
        console.log(`Hosted zone '${Name}' does not exist. Skipping deletion.`);
        continue;
      }
      const params = {
        Id: foundZone.Id,
      };
      const deleteCommand = new DeleteHostedZoneCommand(params);

      // Send the command to Route 53
      await client.send(deleteCommand);
      console.log(`Hosted zone deleted successfully: ${Name}`);
      deletionResults.push({ domain: Name, status: 'Deleted' });
    }

    // Send responses to the client
    res.status(204).json(deletionResults);
    console.log(`Given Hosted zones deleted successfully`);



  } catch (error) {
    console.error('Error deleting hosted zones:', error);
    res.status(500).json({ error: 'Error deleting hosted zones' });
  }
};


//  create a hosted zones or Domains

export const createZone = async (req, res) => {
  try {
    const domainList = req.body;
    const currentHostedZones = await isDomainExist();
    console.log(currentHostedZones, 'existing zones ');
    const responses = []; //for final log
    for (const domain of domainList) {
      const { Name, PrivateZone, Comment } = domain;
      // Check if the domain already exists
      // console.log(existingHostedZones,' ==== ',Name)
      if (
        currentHostedZones.find(
          (zone) =>
            zone.Name.toLowerCase() == (Name + '.').toLowerCase() ||
            zone.Name.toLowerCase() == Name.toLowerCase(),
        )
      ) {
        console.log(`Hosted zone '${Name}' already exists. Skipping creation.`);
        continue;
      }
      const zoneParams = {
        Name: Name, // Domain name
        CallerReference: `usman-${Date.now()}`,
        HostedZoneConfig: {
          Comment: Comment || ' ',
          PrivateZone: PrivateZone || false,
        },
      };

      const createZoneCommand= new CreateHostedZoneCommand(zoneParams);
      const { HostedZone } = await client.send(createZoneCommand);
      // console.log(`Hosted zone created successfully: ${HostedZone.Name}`);
      responses.push(HostedZone.Name);
    }

    // Send responses to the client
    res.status(201).json(responses);

    console.log(
      responses.length === 0
        ? 'No domain is created because all are already exist'
        : `these Hosted zones created successfully ${responses}`,
    );
  } catch (error) {
    console.error('Error creating hosted zones:', error);
    res.status(500).json({ error: 'Error creating hosted zones' });
  }
};
