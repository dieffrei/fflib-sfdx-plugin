import { core, SfdxCommand } from '@salesforce/command';
import { Project, SfdxError } from '@salesforce/core';
import { template, templateSettings } from 'dot';
import { writeFile } from 'fs';
import { DescribeSObjectResult } from 'jsforce/describe-result';
import { apexMetadataSource, selectorTemplates } from '../../../templates/';
import { sObject } from '../../../utils';

templateSettings.strip = false;

const logError = (err: Error) => err ? console.log(err) : null;

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('fflib', 'org');

export default class Selector extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  public static examples = [
    '$ sfdx fflib:source:selector'
  ];
  public static args = [{name: 'sObjectName'}];

  protected static flagsConfig = {
    outputpath: { char: 'o', required: true, description: 'Output path' }
  };
  protected static requiresUsername = true;
  protected static supportsDevhubUsername = true;
  protected static requiresProject = true;

  public async run(): Promise<core.AnyJson> {

    const project = await Project.resolve();
    const basePath = project.getPath();

    if (!project) {
      throw new SfdxError(messages.getMessage('errorNoSfdxProject'));
    }

    const conn = this.org.getConnection();
    const result: DescribeSObjectResult = await conn.describe(this.args.sObjectName);

    const sobj: sObject = new sObject(result);

    const selectorClassTemplate = template(selectorTemplates.selectorClass);
    const selectorInterfaceTemplate = template(selectorTemplates.selectorInterface);

    const implementationClassContent = selectorClassTemplate({ sobj });
    const interfaceContent = selectorInterfaceTemplate({ sobj });
    console.log(implementationClassContent);
    console.log(interfaceContent);
    writeFile(`${basePath}/${this.flags.outputpath}/${sobj.getClassImplementationFileName()}`, implementationClassContent, logError);
    writeFile(`${basePath}/${this.flags.outputpath}/${sobj.getImplementationClassMetadataFileName()}`, apexMetadataSource, logError);

    writeFile(`${basePath}/${this.flags.outputpath}/${sobj.getInterfaceFileName()}`, interfaceContent, logError);
    writeFile(`${basePath}/${this.flags.outputpath}/${sobj.getInterfaceMetadataFileName()}`, apexMetadataSource, logError);

    return {};

  }

}
