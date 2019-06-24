import { Field } from 'jsforce';
import { DescribeSObjectResult } from 'jsforce/describe-result';

// tslint:disable-next-line:class-name
class sObject {

  private sobjectDescribeResult: DescribeSObjectResult;

  constructor(sobjectDescribeResult: DescribeSObjectResult) {
    this.sobjectDescribeResult = sobjectDescribeResult;
  }

  public getFields(): Field[] {
    return this.sobjectDescribeResult.fields;
  }

  public getApiName(): string {
    return this.sobjectDescribeResult.name;
  }

  public getName(): string {
    return this.sobjectDescribeResult.name.replace('__c', '').replace('_', '');
  }

  public getInterfaceName(): string {
    return this.getName() + 'Selector';
  }

  public getInterfaceFileName(): string {
    return this.getInterfaceName() + '.cls';
  }

  public getInterfaceMetadataFileName(): string {
    return this.getInterfaceFileName() + '-meta.xml';
  }

  public getClassImplementationName(): string {
    return 'SFDB' + this.getName() + 'Selector';
  }

  public getClassImplementationFileName(): string {
    return 'SFDB' + this.getName() + 'Selector.cls';
  }

  public getImplementationClassMetadataFileName(): string {
    return this.getClassImplementationFileName() + '-meta.xml';
  }

}

export default sObject;
