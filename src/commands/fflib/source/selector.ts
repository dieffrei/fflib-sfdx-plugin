import {core, flags, SfdxCommand} from '@salesforce/command';
import {SfdxError, Project} from '@salesforce/core';
import {DescribeSObjectResult} from "jsforce/describe-result";
import {Field} from "jsforce";

const fs = require('fs');
const _ = require('underscore');
const dot = require('dot');

dot.templateSettings.strip = false;

export class Sobject {

  private sobjectDescribeResult:DescribeSObjectResult;

  constructor(sobjectDescribeResult:DescribeSObjectResult) {
    this.sobjectDescribeResult = sobjectDescribeResult;
  }

  public getFields() : Field[] {
    return this.sobjectDescribeResult.fields;
  }

  public getApiName() : string {
    return this.sobjectDescribeResult.name;
  }

  public getName() : string {
    //TODO
    return this.sobjectDescribeResult.name.replace('__c', '')
      .replace('gui_tkt__', '')
      .replace('_', '');
  }

  public getInterfaceName() : string {
    return this.getName() + 'Selector';
  }

  public getInterfaceFileName() : string {
    return this.getInterfaceName() + '.cls';
  }

  public getInterfaceMetadataFileName() : string {
    return this.getInterfaceFileName() + '-meta.xml';
  }

  public getClassImplementationName() : string {
    return 'SFDB' + this.getName() + 'Selector';
  }

  public getClassImplementationFileName() : string {
    return 'SFDB' + this.getName() + 'Selector.cls';
  }

  public getImplementationClassMetadataFileName() : string {
    return this.getClassImplementationFileName() + '-meta.xml';
  }

}

//TODO: move to a separate file
const metadataTemplateSource:string =
`<?xml version="1.0" encoding="UTF-8"?>
<ApexClass xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>44.0</apiVersion>
    <status>Active</status>
</ApexClass>`;

//TODO: move to a separate file
const selectorTemplateSource:string =
`public with sharing class {{=it.sobject.getClassImplementationName()}} extends gui_utl.fflib_SObjectSelector implements {{=it.sobject.getInterfaceName()}} {

    override
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            {{~it.sobject.getFields() :field }}Schema.{{=it.sobject.getApiName()}}.{{=field.name}},
            {{~}}
        };
    }

    override
    public Schema.SObjectType getSObjectType() {
        return Schema.{{=it.sobject.getApiName()}}.SObjectType;
    }
    
    override
    public gui_utl.fflib_QueryFactory newQueryFactory() {
        return super.newQueryFactory();
    }

    override
    public void configureQueryFactoryFields(gui_utl.fflib_QueryFactory queryFactory, String relationshipFieldPath) {
        super.configureQueryFactoryFields(queryFactory, relationshipFieldPath);
    }

    override
    public gui_utl.fflib_QueryFactory addQueryFactorySubselect(gui_utl.fflib_QueryFactory parentQueryFactory, String relationshipName) {
        return super.addQueryFactorySubselect(parentQueryFactory, relationshipName);
    }

    public Schema.{{=it.sobject.getApiName()}} findById(Id id) {
        return this.findById(new Set<Id> {id})[0];
    }

    public List<Schema.{{=it.sobject.getApiName()}}> findById(Set<Id> ids) {
        return this.selectSObjectsById(ids);
    }

}`;

//TODO: move to a separate file
const selectorInterfaceTemplateSource:string =
`public interface {{=it.sobject.getInterfaceName()}} {
    gui_utl.fflib_QueryFactory addQueryFactorySubselect(gui_utl.fflib_QueryFactory parentQueryFactory, String relationshipName);
    gui_utl.fflib_QueryFactory newQueryFactory();
    void configureQueryFactoryFields(gui_utl.fflib_QueryFactory queryFactory, String relationshipFieldPath);
    Schema.{{=it.sobject.getApiName()}} findById(Id id);
    List<Schema.{{=it.sobject.getApiName()}}> findById(Set<Id> ids);
}`;

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages('guidion', 'org');

export default class Selector extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');
  public static examples = [
    `$ sfdx fflib:source:selector`
  ];
  protected static flagsConfig = {
    outputpath: { char: 'o', required: true, description: 'Output path' }
  };
  protected static requiresUsername = true;
  protected static supportsDevhubUsername = true;
  protected static requiresProject = true;

  public static args = [{name: 'customObjectApiName'}];

  public async run(): Promise<core.AnyJson> {

    const project = await Project.resolve();
    const basePath = project.getPath();

    if (!project) {
      throw new SfdxError(messages.getMessage('errorNoSfdxProject'));
    }

    const conn = this.org.getConnection();
    const result:DescribeSObjectResult = await conn.describe(this.args.customObjectApiName);

    const sObject:Sobject = new Sobject(result);

    const selectorClassTemplate = dot.template(selectorTemplateSource);
    const selectorInterfaceTemplate = dot.template(selectorInterfaceTemplateSource);

    const implementationClassContent = selectorClassTemplate({sobject: sObject});
    const interfaceContent = selectorInterfaceTemplate({sobject: sObject});

    fs.writeFile(`${basePath}/${this.flags.outputpath}/${sObject.getClassImplementationFileName()}`, implementationClassContent);
    fs.writeFile(`${basePath}/${this.flags.outputpath}/${sObject.getImplementationClassMetadataFileName()}`, metadataTemplateSource);

    fs.writeFile(`${basePath}/${this.flags.outputpath}/${sObject.getInterfaceFileName()}`, interfaceContent);
    fs.writeFile(`${basePath}/${this.flags.outputpath}/${sObject.getInterfaceMetadataFileName()}`, metadataTemplateSource);

    return {};

  }

}
