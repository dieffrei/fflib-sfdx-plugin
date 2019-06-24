const selectorClass: string =
`public inherited sharing class {{=it.sobj.getClassImplementationName()}} extends gui_utl.fflib_SObjectSelector implements {{=it.sobj.getInterfaceName()}} {

    override
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            {{~it.sobj.getFields() :field }}Schema.{{=it.sobj.getApiName()}}.{{=field.name}},
            {{~}}
        };
    }

    override
    public Schema.SObjectType getSObjectType() {
        return Schema.{{=it.sobj.getApiName()}}.SObjectType;
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

    public Schema.{{=it.sobj.getApiName()}} findById(Id id) {
        return this.findById(new Set<Id> {id})[0];
    }

    public List<Schema.{{=it.sobj.getApiName()}}> findById(Set<Id> ids) {
        return this.selectSObjectsById(ids);
    }

}`;

export default selectorClass;
