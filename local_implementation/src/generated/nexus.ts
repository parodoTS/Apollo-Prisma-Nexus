/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { context } from "./../context.js"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ClientInput: { // input type
    businessType: NexusGenEnums['BusinessType']; // BusinessType!
    description?: string | null; // String
    location: string; // String!
    name: string; // String!
    organization?: string | null; // String
  }
  SearchFilterInput: { // input type
    businessType?: NexusGenEnums['BusinessType'] | null; // BusinessType
    location?: string | null; // String
    organization?: string | null; // String
  }
}

export interface NexusGenEnums {
  BusinessType: "AUTO" | "FINANCE" | "MANUFACTURING" | "PUBLIC" | "UNDEFINED"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Client: { // root type
    businessType: NexusGenEnums['BusinessType']; // BusinessType!
    code: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description?: string | null; // String
    id: string; // ID!
    location: string; // String!
    name: string; // String!
    organization?: string | null; // String
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Mutation: {};
  Query: {};
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Client: { // field return type
    businessType: NexusGenEnums['BusinessType']; // BusinessType!
    code: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    description: string | null; // String
    id: string; // ID!
    location: string; // String!
    name: string; // String!
    organization: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  Mutation: { // field return type
    createClient: NexusGenRootTypes['Client'] | null; // Client
    deleteClient: NexusGenRootTypes['Client'] | null; // Client
    updateClient: NexusGenRootTypes['Client'] | null; // Client
  }
  Query: { // field return type
    readClient: NexusGenRootTypes['Client'] | null; // Client
    searchClients: Array<NexusGenRootTypes['Client'] | null> | null; // [Client]
  }
}

export interface NexusGenFieldTypeNames {
  Client: { // field return type name
    businessType: 'BusinessType'
    code: 'String'
    createdAt: 'DateTime'
    description: 'String'
    id: 'ID'
    location: 'String'
    name: 'String'
    organization: 'String'
    updatedAt: 'DateTime'
  }
  Mutation: { // field return type name
    createClient: 'Client'
    deleteClient: 'Client'
    updateClient: 'Client'
  }
  Query: { // field return type name
    readClient: 'Client'
    searchClients: 'Client'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createClient: { // args
      input: NexusGenInputs['ClientInput']; // ClientInput!
    }
    deleteClient: { // args
      code: string; // String!
    }
    updateClient: { // args
      code: string; // String!
      input: NexusGenInputs['ClientInput']; // ClientInput!
    }
  }
  Query: {
    readClient: { // args
      code: string; // String!
    }
    searchClients: { // args
      input: NexusGenInputs['SearchFilterInput']; // SearchFilterInput!
      offset?: number | null; // Int
      pageSize?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}