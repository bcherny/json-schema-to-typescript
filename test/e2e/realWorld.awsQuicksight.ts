// @see https://github.com/bcherny/json-schema-to-typescript/issues/438
export const input = {
  typeName: 'AWS::QuickSight::DataSet',
  description: 'Definition of the AWS::QuickSight::DataSet Resource Type.',
  definitions: {
    CalculatedColumn: {
      type: 'object',
      description: '<p>A calculated column for a dataset.</p>',
      properties: {
        ColumnId: {
          type: 'string',
          maxLength: 64,
          minLength: 1,
          description:
            '<p>A unique ID to identify a calculated column. During a dataset update, if the column ID\n            of a calculated column matches that of an existing calculated column, Amazon QuickSight\n            preserves the existing calculated column.</p>'
        },
        ColumnName: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>Column name.</p>'
        },
        Expression: {
          type: 'string',
          maxLength: 4096,
          minLength: 1,
          description: '<p>An expression that defines the calculated column.</p>'
        }
      },
      required: ['ColumnId', 'ColumnName', 'Expression']
    },
    CastColumnTypeOperation: {
      type: 'object',
      description: '<p>A transform operation that casts a column to a different type.</p>',
      properties: {
        ColumnName: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>Column name.</p>'
        },
        Format: {
          type: 'string',
          maxLength: 32,
          minLength: 0,
          description:
            '<p>When casting a column from string to datetime type, you can supply a string in a\n            format supported by Amazon QuickSight to denote the source data format.</p>'
        },
        NewColumnType: {
          $ref: '#/definitions/ColumnDataType'
        }
      },
      required: ['ColumnName', 'NewColumnType']
    },
    ColumnDataType: {
      type: 'string',
      enum: ['STRING', 'INTEGER', 'DECIMAL', 'DATETIME']
    },
    ColumnDescription: {
      type: 'object',
      description: '<p>Metadata that contains a description for a column.</p>',
      properties: {
        Text: {
          type: 'string',
          maxLength: 500,
          minLength: 0,
          description: '<p>The text of a description for a column.</p>'
        }
      }
    },
    ColumnGroup: {
      type: 'object',
      description:
        '<p>Groupings of columns that work together in certain Amazon QuickSight features. This is\n            a variant type structure. For this structure to be valid, only one of the attributes can\n            be non-null.</p>',
      properties: {
        GeoSpatialColumnGroup: {
          $ref: '#/definitions/GeoSpatialColumnGroup'
        }
      }
    },
    ColumnLevelPermissionRule: {
      type: 'object',
      properties: {
        ColumnNames: {
          type: 'array',
          items: {
            type: 'string'
          },
          minItems: 1
        },
        Principals: {
          type: 'array',
          items: {
            type: 'string'
          },
          maxItems: 100,
          minItems: 1
        }
      }
    },
    ColumnTag: {
      type: 'object',
      description:
        '<p>A tag for a column in a <a>TagColumnOperation</a> structure. This is a\n            variant type structure. For this structure to be valid, only one of the attributes can\n            be non-null.</p>',
      properties: {
        ColumnGeographicRole: {
          $ref: '#/definitions/GeoSpatialDataRole'
        },
        ColumnDescription: {
          $ref: '#/definitions/ColumnDescription'
        }
      }
    },
    CreateColumnsOperation: {
      type: 'object',
      description:
        '<p>A transform operation that creates calculated columns. Columns created in one such\n            operation form a lexical closure.</p>',
      properties: {
        Columns: {
          type: 'array',
          items: {
            $ref: '#/definitions/CalculatedColumn'
          },
          maxItems: 128,
          minItems: 1,
          description: '<p>Calculated columns to create.</p>'
        }
      },
      required: ['Columns']
    },
    CustomSql: {
      type: 'object',
      description: '<p>A physical table type built from the results of the custom SQL query.</p>',
      properties: {
        DataSourceArn: {
          type: 'string',
          description: '<p>The Amazon Resource Name (ARN) of the data source.</p>'
        },
        SqlQuery: {
          type: 'string',
          maxLength: 65536,
          minLength: 1,
          description: '<p>The SQL query.</p>'
        },
        Columns: {
          type: 'array',
          items: {
            $ref: '#/definitions/InputColumn'
          },
          maxItems: 2048,
          minItems: 1,
          description: '<p>The column schema from the SQL query result set.</p>'
        },
        Name: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>A display name for the SQL query result.</p>'
        }
      },
      required: ['Columns', 'DataSourceArn', 'Name', 'SqlQuery']
    },
    DataSetImportMode: {
      type: 'string',
      enum: ['SPICE', 'DIRECT_QUERY']
    },
    FieldFolder: {
      type: 'object',
      properties: {
        Description: {
          type: 'string',
          maxLength: 500,
          minLength: 0
        },
        Columns: {
          type: 'array',
          items: {
            type: 'string'
          },
          maxItems: 5000,
          minItems: 0
        }
      }
    },
    FieldFolderMap: {
      type: 'object',
      patternProperties: {
        '.+': {
          $ref: '#/definitions/FieldFolder'
        }
      }
    },
    FileFormat: {
      type: 'string',
      enum: ['CSV', 'TSV', 'CLF', 'ELF', 'XLSX', 'JSON']
    },
    FilterOperation: {
      type: 'object',
      description: '<p>A transform operation that filters rows based on a condition.</p>',
      properties: {
        ConditionExpression: {
          type: 'string',
          maxLength: 4096,
          minLength: 1,
          description:
            '<p>An expression that must evaluate to a Boolean value. Rows for which the expression\n            evaluates to true are kept in the dataset.</p>'
        }
      },
      required: ['ConditionExpression']
    },
    GeoSpatialColumnGroup: {
      type: 'object',
      description: '<p>Geospatial column group that denotes a hierarchy.</p>',
      properties: {
        Columns: {
          type: 'array',
          items: {
            type: 'string',
            maxLength: 128,
            minLength: 1
          },
          maxItems: 16,
          minItems: 1,
          description: '<p>Columns in this hierarchy.</p>'
        },
        CountryCode: {
          $ref: '#/definitions/GeoSpatialCountryCode'
        },
        Name: {
          type: 'string',
          maxLength: 64,
          minLength: 1,
          description: '<p>A display name for the hierarchy.</p>'
        }
      },
      required: ['Columns', 'Name']
    },
    GeoSpatialCountryCode: {
      type: 'string',
      enum: ['US']
    },
    GeoSpatialDataRole: {
      type: 'string',
      enum: ['COUNTRY', 'STATE', 'COUNTY', 'CITY', 'POSTCODE', 'LONGITUDE', 'LATITUDE', 'POLITICAL1']
    },
    InputColumn: {
      type: 'object',
      description: '<p>Metadata for a column that is used as the input of a transform operation.</p>',
      properties: {
        Type: {
          $ref: '#/definitions/InputColumnDataType'
        },
        Name: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>The name of this column in the underlying data source.</p>'
        }
      },
      required: ['Name', 'Type']
    },
    InputColumnDataType: {
      type: 'string',
      enum: ['STRING', 'INTEGER', 'DECIMAL', 'DATETIME', 'BIT', 'BOOLEAN', 'JSON']
    },
    JoinInstruction: {
      type: 'object',
      description: '<p>Join instruction.</p>',
      properties: {
        OnClause: {
          type: 'string',
          maxLength: 512,
          minLength: 1,
          description: '<p>On Clause.</p>'
        },
        Type: {
          $ref: '#/definitions/JoinType'
        },
        LeftJoinKeyProperties: {
          $ref: '#/definitions/JoinKeyProperties'
        },
        LeftOperand: {
          type: 'string',
          maxLength: 64,
          minLength: 1,
          pattern: '[0-9a-zA-Z-]*',
          description: '<p>Left operand.</p>'
        },
        RightOperand: {
          type: 'string',
          maxLength: 64,
          minLength: 1,
          pattern: '[0-9a-zA-Z-]*',
          description: '<p>Right operand.</p>'
        },
        RightJoinKeyProperties: {
          $ref: '#/definitions/JoinKeyProperties'
        }
      },
      required: ['LeftOperand', 'OnClause', 'RightOperand', 'Type']
    },
    JoinKeyProperties: {
      type: 'object',
      properties: {
        UniqueKey: {
          type: 'boolean'
        }
      }
    },
    JoinType: {
      type: 'string',
      enum: ['INNER', 'OUTER', 'LEFT', 'RIGHT']
    },
    LogicalTable: {
      type: 'object',
      description:
        '<p>A <i>logical table</i> is a unit that joins and that data\n            transformations operate on. A logical table has a source, which can be either a physical\n            table or result of a join. When a logical table points to a physical table, the logical\n            table acts as a mutable copy of that physical table through transform operations.</p>',
      properties: {
        Alias: {
          type: 'string',
          maxLength: 64,
          minLength: 1,
          description: '<p>A display name for the logical table.</p>'
        },
        DataTransforms: {
          type: 'array',
          items: {
            $ref: '#/definitions/TransformOperation'
          },
          maxItems: 2048,
          minItems: 1,
          description: '<p>Transform operations that act on this logical table.</p>'
        },
        Source: {
          $ref: '#/definitions/LogicalTableSource'
        }
      },
      required: ['Alias', 'Source']
    },
    LogicalTableMap: {
      type: 'object',
      maxProperties: 64,
      minProperties: 1,
      patternProperties: {
        '[0-9a-zA-Z-]*': {
          $ref: '#/definitions/LogicalTable'
        }
      }
    },
    LogicalTableSource: {
      type: 'object',
      description:
        '<p>Information about the source of a logical table. This is a variant type structure. For\n            this structure to be valid, only one of the attributes can be non-null.</p>',
      properties: {
        PhysicalTableId: {
          type: 'string',
          maxLength: 64,
          minLength: 1,
          pattern: '[0-9a-zA-Z-]*',
          description: '<p>Physical table ID.</p>'
        },
        JoinInstruction: {
          $ref: '#/definitions/JoinInstruction'
        }
      }
    },
    OutputColumn: {
      type: 'object',
      description: '<p>Output column.</p>',
      properties: {
        Type: {
          $ref: '#/definitions/ColumnDataType'
        },
        Description: {
          type: 'string',
          maxLength: 500,
          minLength: 0,
          description: '<p>A description for a column.</p>'
        },
        Name: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>A display name for the dataset.</p>'
        }
      }
    },
    PhysicalTable: {
      type: 'object',
      description:
        '<p>A view of a data source that contains information about the shape of the data in the\n            underlying source. This is a variant type structure. For this structure to be valid,\n            only one of the attributes can be non-null.</p>',
      properties: {
        RelationalTable: {
          $ref: '#/definitions/RelationalTable'
        },
        CustomSql: {
          $ref: '#/definitions/CustomSql'
        },
        S3Source: {
          $ref: '#/definitions/S3Source'
        }
      }
    },
    PhysicalTableMap: {
      type: 'object',
      maxProperties: 32,
      minProperties: 1,
      patternProperties: {
        '[0-9a-zA-Z-]*': {
          $ref: '#/definitions/PhysicalTable'
        }
      }
    },
    ProjectOperation: {
      type: 'object',
      description:
        '<p>A transform operation that projects columns. Operations that come after a projection\n            can only refer to projected columns.</p>',
      properties: {
        ProjectedColumns: {
          type: 'array',
          items: {
            type: 'string'
          },
          maxItems: 2000,
          minItems: 1,
          description: '<p>Projected columns.</p>'
        }
      },
      required: ['ProjectedColumns']
    },
    RelationalTable: {
      type: 'object',
      description: '<p>A physical table type for relational data sources.</p>',
      properties: {
        DataSourceArn: {
          type: 'string',
          description: '<p>The Amazon Resource Name (ARN) for the data source.</p>'
        },
        InputColumns: {
          type: 'array',
          items: {
            $ref: '#/definitions/InputColumn'
          },
          maxItems: 2048,
          minItems: 1,
          description: '<p>The column schema of the table.</p>'
        },
        Schema: {
          type: 'string',
          maxLength: 64,
          minLength: 0,
          description: '<p>The schema name. This name applies to certain relational database engines.</p>'
        },
        Catalog: {
          type: 'string',
          description: '<p>The catalog associated with a table.</p>',
          maxLength: 256,
          minLength: 0
        },
        Name: {
          type: 'string',
          maxLength: 64,
          minLength: 1,
          description: '<p>The name of the relational table.</p>'
        }
      },
      required: ['DataSourceArn', 'InputColumns', 'Name']
    },
    RenameColumnOperation: {
      type: 'object',
      description: '<p>A transform operation that renames a column.</p>',
      properties: {
        NewColumnName: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>The new name for the column.</p>'
        },
        ColumnName: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>The name of the column to be renamed.</p>'
        }
      },
      required: ['ColumnName', 'NewColumnName']
    },
    ResourcePermission: {
      type: 'object',
      description: '<p>Permission for the resource.</p>',
      properties: {
        Actions: {
          type: 'array',
          items: {
            type: 'string'
          },
          maxItems: 16,
          minItems: 1,
          description: '<p>The IAM action to grant or revoke permissions on.</p>'
        },
        Principal: {
          type: 'string',
          maxLength: 256,
          minLength: 1,
          description:
            '<p>The Amazon Resource Name (ARN) of the principal. This can be one of the\n            following:</p>\n        <ul>\n            <li>\n                <p>The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)</p>\n            </li>\n            <li>\n                <p>The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)</p>\n            </li>\n            <li>\n                <p>The ARN of an AWS account root: This is an IAM ARN rather than a QuickSight\n                    ARN. Use this option only to share resources (templates) across AWS accounts.\n                    (This is less common.) </p>\n            </li>\n         </ul>'
        }
      },
      required: ['Actions', 'Principal']
    },
    RowLevelPermissionDataSet: {
      type: 'object',
      description: '<p>The row-level security configuration for the dataset.</p>',
      properties: {
        Arn: {
          type: 'string',
          description: '<p>The Amazon Resource Name (ARN) of the permission dataset.</p>'
        },
        Namespace: {
          type: 'string',
          maxLength: 64,
          minLength: 0,
          pattern: '^[a-zA-Z0-9._-]*$',
          description: '<p>The namespace associated with the row-level permissions dataset.</p>'
        },
        PermissionPolicy: {
          $ref: '#/definitions/RowLevelPermissionPolicy'
        },
        FormatVersion: {
          $ref: '#/definitions/RowLevelPermissionFormatVersion'
        }
      },
      required: ['Arn', 'PermissionPolicy']
    },
    RowLevelPermissionPolicy: {
      type: 'string',
      enum: ['GRANT_ACCESS', 'DENY_ACCESS']
    },
    RowLevelPermissionFormatVersion: {
      type: 'string',
      enum: ['VERSION_1', 'VERSION_2']
    },
    S3Source: {
      type: 'object',
      description: '<p>A physical table type for as S3 data source.</p>',
      properties: {
        DataSourceArn: {
          type: 'string',
          description: '<p>The amazon Resource Name (ARN) for the data source.</p>'
        },
        InputColumns: {
          type: 'array',
          items: {
            $ref: '#/definitions/InputColumn'
          },
          maxItems: 2048,
          minItems: 1,
          description: '<p>A physical table type for as S3 data source.</p>'
        },
        UploadSettings: {
          $ref: '#/definitions/UploadSettings'
        }
      },
      required: ['DataSourceArn', 'InputColumns']
    },
    Tag: {
      type: 'object',
      description:
        '<p>The key or keys of the key-value pairs for the resource tag or tags assigned to the\n            resource.</p>',
      properties: {
        Value: {
          type: 'string',
          maxLength: 256,
          minLength: 1,
          description: '<p>Tag value.</p>'
        },
        Key: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>Tag key.</p>'
        }
      },
      required: ['Key', 'Value']
    },
    TagColumnOperation: {
      type: 'object',
      description: '<p>A transform operation that tags a column with additional information.</p>',
      properties: {
        ColumnName: {
          type: 'string',
          maxLength: 128,
          minLength: 1,
          description: '<p>The column that this operation acts on.</p>'
        },
        Tags: {
          type: 'array',
          items: {
            $ref: '#/definitions/ColumnTag'
          },
          maxItems: 16,
          minItems: 1,
          description:
            '<p>The dataset column tag, currently only used for geospatial type tagging. .</p>\n        <note>\n            <p>This is not tags for the AWS tagging feature. .</p>\n        </note>'
        }
      },
      required: ['ColumnName', 'Tags']
    },
    TextQualifier: {
      type: 'string',
      enum: ['DOUBLE_QUOTE', 'SINGLE_QUOTE']
    },
    TransformOperation: {
      type: 'object',
      description:
        '<p>A data transformation on a logical table. This is a variant type structure. For this\n            structure to be valid, only one of the attributes can be non-null.</p>',
      properties: {
        TagColumnOperation: {
          $ref: '#/definitions/TagColumnOperation'
        },
        FilterOperation: {
          $ref: '#/definitions/FilterOperation'
        },
        CastColumnTypeOperation: {
          $ref: '#/definitions/CastColumnTypeOperation'
        },
        CreateColumnsOperation: {
          $ref: '#/definitions/CreateColumnsOperation'
        },
        RenameColumnOperation: {
          $ref: '#/definitions/RenameColumnOperation'
        },
        ProjectOperation: {
          $ref: '#/definitions/ProjectOperation'
        }
      }
    },
    UploadSettings: {
      type: 'object',
      description: '<p>Information about the format for a source file or files.</p>',
      properties: {
        ContainsHeader: {
          type: 'boolean',
          description: '<p>Whether the file has a header row, or the files each have a header row.</p>'
        },
        TextQualifier: {
          $ref: '#/definitions/TextQualifier'
        },
        Format: {
          $ref: '#/definitions/FileFormat'
        },
        StartFromRow: {
          type: 'number',
          minimum: 1,
          description: '<p>A row number to start reading data from.</p>'
        },
        Delimiter: {
          type: 'string',
          maxLength: 1,
          minLength: 1,
          description: '<p>The delimiter between values in the file.</p>'
        }
      }
    },
    IngestionWaitPolicy: {
      type: 'object',
      description:
        '<p>Wait policy to use when creating/updating dataset. Default is to wait for SPICE ingestion to finish with timeout of 36 hours.</p>',
      properties: {
        WaitForSpiceIngestion: {
          type: 'boolean',
          description:
            '<p>Wait for SPICE ingestion to finish to mark dataset creation/update successful. Default (true).\n  Applicable only when DataSetImportMode mode is set to SPICE.</p>',
          default: true
        },
        IngestionWaitTimeInHours: {
          type: 'number',
          description:
            '<p>The maximum time (in hours) to wait for Ingestion to complete. Default timeout is 36 hours.\n Applicable only when DataSetImportMode mode is set to SPICE and WaitForSpiceIngestion is set to true.</p>',
          minimum: 1,
          maximum: 36,
          default: 36
        }
      }
    }
  },
  properties: {
    Arn: {
      type: 'string',
      description: '<p>The Amazon Resource Name (ARN) of the resource.</p>'
    },
    AwsAccountId: {
      type: 'string',
      maxLength: 12,
      minLength: 12,
      pattern: '^[0-9]{12}$'
    },
    ColumnGroups: {
      type: 'array',
      items: {
        $ref: '#/definitions/ColumnGroup'
      },
      maxItems: 8,
      minItems: 1,
      description:
        '<p>Groupings of columns that work together in certain QuickSight features. Currently, only geospatial hierarchy is supported.</p>'
    },
    ColumnLevelPermissionRules: {
      type: 'array',
      items: {
        $ref: '#/definitions/ColumnLevelPermissionRule'
      },
      minItems: 1
    },
    ConsumedSpiceCapacityInBytes: {
      type: 'number',
      description:
        "<p>The amount of SPICE capacity used by this dataset. This is 0 if the dataset isn't\n            imported into SPICE.</p>"
    },
    CreatedTime: {
      type: 'string',
      description: '<p>The time that this dataset was created.</p>',
      format: 'string'
    },
    DataSetId: {
      type: 'string'
    },
    FieldFolders: {
      $ref: '#/definitions/FieldFolderMap'
    },
    ImportMode: {
      $ref: '#/definitions/DataSetImportMode'
    },
    LastUpdatedTime: {
      type: 'string',
      description: '<p>The last time that this dataset was updated.</p>',
      format: 'string'
    },
    LogicalTableMap: {
      $ref: '#/definitions/LogicalTableMap'
    },
    Name: {
      type: 'string',
      maxLength: 128,
      minLength: 1,
      description: '<p>The display name for the dataset.</p>'
    },
    OutputColumns: {
      type: 'array',
      items: {
        $ref: '#/definitions/OutputColumn'
      },
      description:
        '<p>The list of columns after all transforms. These columns are available in templates,\n            analyses, and dashboards.</p>'
    },
    Permissions: {
      type: 'array',
      items: {
        $ref: '#/definitions/ResourcePermission'
      },
      maxItems: 64,
      minItems: 1,
      description: '<p>A list of resource permissions on the dataset.</p>'
    },
    PhysicalTableMap: {
      $ref: '#/definitions/PhysicalTableMap'
    },
    RowLevelPermissionDataSet: {
      $ref: '#/definitions/RowLevelPermissionDataSet'
    },
    Tags: {
      type: 'array',
      items: {
        $ref: '#/definitions/Tag'
      },
      maxItems: 200,
      minItems: 1,
      description: '<p>Contains a map of the key-value pairs for the resource tag or tags assigned to the dataset.</p>'
    },
    IngestionWaitPolicy: {
      $ref: '#/definitions/IngestionWaitPolicy'
    }
  },
  readOnlyProperties: [
    '/properties/Arn',
    '/properties/ConsumedSpiceCapacityInBytes',
    '/properties/CreatedTime',
    '/properties/LastUpdatedTime',
    '/properties/OutputColumns'
  ],
  writeOnlyProperties: ['/properties/FieldFolders', '/properties/IngestionWaitPolicy'],
  createOnlyProperties: ['/properties/AwsAccountId', '/properties/DataSetId'],
  primaryIdentifier: ['/properties/AwsAccountId', '/properties/DataSetId'],
  additionalProperties: false,
  handlers: {
    create: {
      permissions: [
        'quicksight:DescribeDataSet',
        'quicksight:DescribeDataSetPermissions',
        'quicksight:DescribeIngestion',
        'quicksight:CreateDataSet',
        'quicksight:PassDataSource',
        'quicksight:PassDataSet',
        'quicksight:TagResource',
        'quicksight:ListTagsForResource'
      ]
    },
    read: {
      permissions: [
        'quicksight:DescribeDataSet',
        'quicksight:DescribeDataSetPermissions',
        'quicksight:ListTagsForResource'
      ]
    },
    update: {
      permissions: [
        'quicksight:DescribeDataSet',
        'quicksight:DescribeDataSetPermissions',
        'quicksight:PassDataSource',
        'quicksight:UpdateDataSet',
        'quicksight:UpdateDataSetPermissions',
        'quicksight:PassDataSet',
        'quicksight:DescribeIngestion',
        'quicksight:ListIngestions',
        'quicksight:CancelIngestion',
        'quicksight:TagResource',
        'quicksight:UntagResource',
        'quicksight:ListTagsForResource'
      ]
    },
    delete: {
      permissions: [
        'quicksight:DescribeDataSet',
        'quicksight:DeleteDataSet',
        'quicksight:ListTagsForResource',
        'quicksight:DescribeIngestion'
      ]
    },
    list: {
      permissions: ['quicksight:DescribeDataSet', 'quicksight:ListDataSets']
    }
  }
}
