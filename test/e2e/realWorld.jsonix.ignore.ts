export const options = {
  format: false
}

export const input = {
  id: '#',
  definitions: {
    VerifyAllLogs: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyAllLogs',
          properties: {
            check: {
              title: 'check',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Check',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyAllLogs',
        namespaceURI: ''
      },
      propertiesOrder: ['check']
    },
    VerifyBackupDidNotReseed: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyBackupDidNotReseed',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyBackupDidNotReseed',
        namespaceURI: ''
      }
    },
    InstallHyperVHost: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'InstallHyperVHost',
          properties: {
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            },
            installType: {
              title: 'installType',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'InstallType',
                namespaceURI: ''
              }
            },
            management: {
              title: 'management',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Management',
                namespaceURI: ''
              }
            },
            port: {
              title: 'port',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PORT',
                namespaceURI: ''
              }
            },
            installdir: {
              title: 'installdir',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'INSTALLDIR',
                namespaceURI: ''
              }
            },
            log: {
              title: 'log',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LOG',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'InstallHyperVHost',
        namespaceURI: ''
      },
      propertiesOrder: ['targetMachine', 'installType', 'management', 'port', 'installdir', 'log']
    },
    VerifyLogForString: {
      required: ['shouldBeThere', 'useRegEx'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyLogForString',
          properties: {
            findThisString: {
              title: 'findThisString',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FindThisString',
                namespaceURI: ''
              }
            },
            shouldBeThere: {
              title: 'shouldBeThere',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ShouldBeThere',
                namespaceURI: ''
              }
            },
            useRegEx: {
              title: 'useRegEx',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UseRegEx',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyLogForString',
        namespaceURI: ''
      },
      propertiesOrder: ['findThisString', 'shouldBeThere', 'useRegEx']
    },
    VerifyVaultLogsForErrors: {
      required: ['allMatchingFiles'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyVaultLogsForErrors',
          properties: {
            fileName: {
              title: 'fileName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileName',
                namespaceURI: ''
              }
            },
            filePath: {
              title: 'filePath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePath',
                namespaceURI: ''
              }
            },
            allMatchingFiles: {
              title: 'allMatchingFiles',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'AllMatchingFiles',
                namespaceURI: ''
              }
            },
            matchOption: {
              title: 'matchOption',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'MatchOption',
                namespaceURI: ''
              }
            },
            patternString: {
              title: 'patternString',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PatternString',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyVaultLogsForErrors',
        namespaceURI: ''
      },
      propertiesOrder: ['fileName', 'filePath', 'allMatchingFiles', 'matchOption', 'patternString']
    },
    CheckElapsedTime: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckElapsedTime',
          properties: {
            thresholdHHMMSS: {
              title: 'thresholdHHMMSS',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ThresholdHHMMSS',
                namespaceURI: ''
              }
            },
            operator: {
              title: 'operator',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Operator',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckElapsedTime',
        namespaceURI: ''
      },
      propertiesOrder: ['thresholdHHMMSS', 'operator']
    },
    Fail: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Fail',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Fail',
        namespaceURI: ''
      }
    },
    Backup: {
      required: ['wait'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Backup',
          properties: {
            optionsFile: {
              title: 'optionsFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'OptionsFile',
                namespaceURI: ''
              }
            },
            options: {
              title: 'options',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfBackupOptions'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Options',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            },
            wait: {
              title: 'wait',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Wait',
                namespaceURI: ''
              }
            },
            retentionID: {
              title: 'retentionID',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RetentionID',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Backup',
        namespaceURI: ''
      },
      propertiesOrder: ['optionsFile', 'options', 'agent', 'jobName', 'portalMachine', 'wait', 'retentionID']
    },
    CountXLOGs: {
      required: [
        'countBackupLogs',
        'expectedBackupLogs',
        'countRestoreLogs',
        'expectedRestoreLogs',
        'checkIfFailedBackupLog',
        'checkIfSyncLog'
      ],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CountXLOGs',
          properties: {
            countBackupLogs: {
              title: 'countBackupLogs',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CountBackupLogs',
                namespaceURI: ''
              }
            },
            expectedBackupLogs: {
              title: 'expectedBackupLogs',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedBackupLogs',
                namespaceURI: ''
              }
            },
            countRestoreLogs: {
              title: 'countRestoreLogs',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CountRestoreLogs',
                namespaceURI: ''
              }
            },
            expectedRestoreLogs: {
              title: 'expectedRestoreLogs',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedRestoreLogs',
                namespaceURI: ''
              }
            },
            checkIfFailedBackupLog: {
              title: 'checkIfFailedBackupLog',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CheckIfFailedBackupLog',
                namespaceURI: ''
              }
            },
            checkIfSyncLog: {
              title: 'checkIfSyncLog',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CheckIfSyncLog',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CountXLOGs',
        namespaceURI: ''
      },
      propertiesOrder: [
        'countBackupLogs',
        'expectedBackupLogs',
        'countRestoreLogs',
        'expectedRestoreLogs',
        'checkIfFailedBackupLog',
        'checkIfSyncLog'
      ]
    },
    Exchange2010Cmdlet: {
      required: ['cmdlet', 'expectedDBStatus', 'expectedDBIndexState'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Exchange2010Cmdlet',
          properties: {
            onMachine: {
              title: 'onMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnMachine',
                namespaceURI: ''
              }
            },
            dbName: {
              title: 'dbName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DBName',
                namespaceURI: ''
              }
            },
            serverName: {
              title: 'serverName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ServerName',
                namespaceURI: ''
              }
            },
            toServerName: {
              title: 'toServerName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ToServerName',
                namespaceURI: ''
              }
            },
            cmdlet: {
              title: 'cmdlet',
              allOf: [
                {
                  $ref: '#/definitions/CmdletType'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Cmdlet',
                namespaceURI: ''
              }
            },
            expectedDBStatus: {
              title: 'expectedDBStatus',
              allOf: [
                {
                  $ref: '#/definitions/DBCopyStatus'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedDBStatus',
                namespaceURI: ''
              }
            },
            expectedDBIndexState: {
              title: 'expectedDBIndexState',
              allOf: [
                {
                  $ref: '#/definitions/DBContentIndexState'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedDBIndexState',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Exchange2010Cmdlet',
        namespaceURI: ''
      },
      propertiesOrder: [
        'onMachine',
        'dbName',
        'serverName',
        'toServerName',
        'cmdlet',
        'expectedDBStatus',
        'expectedDBIndexState'
      ]
    },
    ManageAgentRetentions: {
      required: ['onlineDays', 'onlineCopies', 'archiveDays'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ManageAgentRetentions',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            action: {
              title: 'action',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Action',
                namespaceURI: ''
              }
            },
            retentionName: {
              title: 'retentionName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RetentionName',
                namespaceURI: ''
              }
            },
            onlineDays: {
              title: 'onlineDays',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnlineDays',
                namespaceURI: ''
              }
            },
            onlineCopies: {
              title: 'onlineCopies',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnlineCopies',
                namespaceURI: ''
              }
            },
            archiveDays: {
              title: 'archiveDays',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ArchiveDays',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ManageAgentRetentions',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'action', 'retentionName', 'onlineDays', 'onlineCopies', 'archiveDays']
    },
    JobProcessing: {
      type: 'object',
      title: 'JobProcessing',
      required: [
        'deltaBlockSize',
        'deferAfter',
        'deltaProcessing',
        'quickFileScan',
        'backupOpenFiles',
        'createLocalCatalog',
        'disablePrescan'
      ],
      properties: {
        compressionLevel: {
          title: 'compressionLevel',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'compressionLevel',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        nameEncoding: {
          title: 'nameEncoding',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'nameEncoding',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        destination: {
          title: 'destination',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'destination',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        retentionId: {
          title: 'retentionId',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'retentionId',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        deltaBlockSize: {
          title: 'deltaBlockSize',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'deltaBlockSize',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        deferAfter: {
          title: 'deferAfter',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'deferAfter',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        deltaProcessing: {
          title: 'deltaProcessing',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'deltaProcessing',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        quickFileScan: {
          title: 'quickFileScan',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'quickFileScan',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        backupOpenFiles: {
          title: 'backupOpenFiles',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'backupOpenFiles',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        createLocalCatalog: {
          title: 'createLocalCatalog',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'createLocalCatalog',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        disablePrescan: {
          title: 'disablePrescan',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'disablePrescan',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'JobProcessing',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: [
        'compressionLevel',
        'nameEncoding',
        'destination',
        'retentionId',
        'deltaBlockSize',
        'deferAfter',
        'deltaProcessing',
        'quickFileScan',
        'backupOpenFiles',
        'createLocalCatalog',
        'disablePrescan',
        'customInfo'
      ]
    },
    VM: {
      type: 'object',
      title: 'VM',
      required: ['_interface', 'specialChars'],
      properties: {
        hostLogon: {
          title: 'hostLogon',
          allOf: [
            {
              $ref: '#/definitions/Credential'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'HostLogon',
            namespaceURI: ''
          }
        },
        extra: {
          title: 'extra',
          allOf: [
            {
              $ref: '#/definitions/VM.Extra'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Extra',
            namespaceURI: ''
          }
        },
        host: {
          title: 'host',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Host',
            namespaceURI: ''
          }
        },
        _interface: {
          title: '_interface',
          allOf: [
            {
              $ref: '#/definitions/InterfaceType'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Interface',
            namespaceURI: ''
          }
        },
        id: {
          title: 'id',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Id',
            namespaceURI: ''
          }
        },
        datacenter: {
          title: 'datacenter',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Datacenter',
            namespaceURI: ''
          }
        },
        snapshot: {
          title: 'snapshot',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Snapshot',
            namespaceURI: ''
          }
        },
        hostIP: {
          title: 'hostIP',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'HostIP',
            namespaceURI: ''
          }
        },
        moveToHostIP: {
          title: 'moveToHostIP',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'MoveToHostIP',
            namespaceURI: ''
          }
        },
        template: {
          title: 'template',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Template',
            namespaceURI: ''
          }
        },
        datastore: {
          title: 'datastore',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Datastore',
            namespaceURI: ''
          }
        },
        moveToDatastore: {
          title: 'moveToDatastore',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'MoveToDatastore',
            namespaceURI: ''
          }
        },
        version: {
          title: 'version',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Version',
            namespaceURI: ''
          }
        },
        networkName: {
          title: 'networkName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'NetworkName',
            namespaceURI: ''
          }
        },
        networkId: {
          title: 'networkId',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'NetworkId',
            namespaceURI: ''
          }
        },
        resourcePool: {
          title: 'resourcePool',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ResourcePool',
            namespaceURI: ''
          }
        },
        folder: {
          title: 'folder',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Folder',
            namespaceURI: ''
          }
        },
        ovaLocation: {
          title: 'ovaLocation',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'OvaLocation',
            namespaceURI: ''
          }
        },
        rpmLocation: {
          title: 'rpmLocation',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'RpmLocation',
            namespaceURI: ''
          }
        },
        shareUser: {
          title: 'shareUser',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ShareUser',
            namespaceURI: ''
          }
        },
        sharePassword: {
          title: 'sharePassword',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'SharePassword',
            namespaceURI: ''
          }
        },
        vmdkName: {
          title: 'vmdkName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'VMDKName',
            namespaceURI: ''
          }
        },
        vmdkPath: {
          title: 'vmdkPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'VMDKPath',
            namespaceURI: ''
          }
        },
        vmdkNameWithEscape: {
          title: 'vmdkNameWithEscape',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'VMDKNameWithEscape',
            namespaceURI: ''
          }
        },
        specialChars: {
          title: 'specialChars',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'SpecialChars',
            namespaceURI: ''
          }
        },
        vraBuildNo: {
          title: 'vraBuildNo',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'VRABuildNo',
            namespaceURI: ''
          }
        },
        rpmBuildNo: {
          title: 'rpmBuildNo',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'RpmBuildNo',
            namespaceURI: ''
          }
        },
        encoding: {
          title: 'encoding',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Encoding',
            namespaceURI: ''
          }
        },
        diskStorageFormat: {
          title: 'diskStorageFormat',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'DiskStorageFormat',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'VM',
        namespaceURI: ''
      },
      propertiesOrder: [
        'hostLogon',
        'extra',
        'host',
        '_interface',
        'id',
        'datacenter',
        'snapshot',
        'hostIP',
        'moveToHostIP',
        'template',
        'datastore',
        'moveToDatastore',
        'version',
        'networkName',
        'networkId',
        'resourcePool',
        'folder',
        'ovaLocation',
        'rpmLocation',
        'shareUser',
        'sharePassword',
        'vmdkName',
        'vmdkPath',
        'vmdkNameWithEscape',
        'specialChars',
        'vraBuildNo',
        'rpmBuildNo',
        'encoding',
        'diskStorageFormat'
      ]
    },
    JobConfigLocal: {
      type: 'object',
      title: 'JobConfigLocal',
      properties: {
        jobGuid: {
          title: 'jobGuid',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'jobGuid',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        vaultGuid: {
          title: 'vaultGuid',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'vaultGuid',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        vaultComputerId: {
          title: 'vaultComputerId',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'vaultComputerId',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        buildVersion: {
          title: 'buildVersion',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'buildVersion',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'JobConfigLocal',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['jobGuid', 'vaultGuid', 'vaultComputerId', 'buildVersion', 'customInfo']
    },
    Suite: {
      type: 'object',
      title: 'Suite',
      required: ['allTestsCritical', 'expectAllFail', 'runPassedTCs', 'hasDependentTCs', 'logCleanup'],
      properties: {
        setup: {
          title: 'setup',
          allOf: [
            {
              $ref: '#/definitions/CommandList'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Setup',
            namespaceURI: ''
          }
        },
        suiteVariable: {
          title: 'suiteVariable',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/SuiteVariable'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'SuiteVariable',
            namespaceURI: ''
          }
        },
        test: {
          title: 'test',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/SuiteTest'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Test',
            namespaceURI: ''
          }
        },
        teardown: {
          title: 'teardown',
          allOf: [
            {
              $ref: '#/definitions/CommandList'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Teardown',
            namespaceURI: ''
          }
        },
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Name',
            namespaceURI: ''
          }
        },
        allTestsCritical: {
          title: 'allTestsCritical',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'AllTestsCritical',
            namespaceURI: ''
          }
        },
        expectAllFail: {
          title: 'expectAllFail',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ExpectAllFail',
            namespaceURI: ''
          }
        },
        runPassedTCs: {
          title: 'runPassedTCs',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'RunPassedTCs',
            namespaceURI: ''
          }
        },
        hasDependentTCs: {
          title: 'hasDependentTCs',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'HasDependentTCs',
            namespaceURI: ''
          }
        },
        logCleanup: {
          title: 'logCleanup',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'LogCleanup',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Suite',
        namespaceURI: ''
      },
      propertiesOrder: [
        'setup',
        'suiteVariable',
        'test',
        'teardown',
        'name',
        'allTestsCritical',
        'expectAllFail',
        'runPassedTCs',
        'hasDependentTCs',
        'logCleanup'
      ]
    },
    ClearEventLogs: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ClearEventLogs',
          properties: {
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ClearEventLogs',
        namespaceURI: ''
      },
      propertiesOrder: ['targetMachine']
    },
    SSHRemoteSystemCommand: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'SSHRemoteSystemCommand',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            userName: {
              title: 'userName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UserName',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SSHRemoteSystemCommand',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'userName', 'password']
    },
    CheckVar: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckVar',
          properties: {
            name: {
              title: 'name',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Name',
                namespaceURI: ''
              }
            },
            expectedValue: {
              title: 'expectedValue',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedValue',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckVar',
        namespaceURI: ''
      },
      propertiesOrder: ['name', 'expectedValue']
    },
    CreateBatchOnWinMachine: {
      allOf: [
        {
          $ref: '#/definitions/CreateScriptFile'
        },
        {
          type: 'object',
          title: 'CreateBatchOnWinMachine',
          properties: {
            batchLines: {
              title: 'batchLines',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'BatchLines',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CreateBatchOnWinMachine',
        namespaceURI: ''
      },
      propertiesOrder: ['batchLines']
    },
    VerifyExchangeDBReseed: {
      required: ['shouldReseed'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyExchangeDBReseed',
          properties: {
            database: {
              title: 'database',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Database',
                namespaceURI: ''
              }
            },
            shouldReseed: {
              title: 'shouldReseed',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ShouldReseed',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyExchangeDBReseed',
        namespaceURI: ''
      },
      propertiesOrder: ['database', 'shouldReseed']
    },
    MoveExchangeDatabases: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'MoveExchangeDatabases',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            dbName: {
              title: 'dbName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DBName',
                namespaceURI: ''
              }
            },
            newEDBLocation: {
              title: 'newEDBLocation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NewEDBLocation',
                namespaceURI: ''
              }
            },
            newLogsLocation: {
              title: 'newLogsLocation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NewLogsLocation',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'MoveExchangeDatabases',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'dbName', 'newEDBLocation', 'newLogsLocation']
    },
    PSMemberInfo: {
      type: 'object',
      title: 'PSMemberInfo',
      required: ['isInstance'],
      properties: {
        isInstance: {
          title: 'isInstance',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'IsInstance',
            namespaceURI: ''
          }
        },
        value: {
          title: 'value',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/anyType'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Value',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'PSMemberInfo',
        namespaceURI: ''
      },
      propertiesOrder: ['isInstance', 'value']
    },
    AddPasswordToJob: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'AddPasswordToJob',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            job: {
              title: 'job',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Job',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            },
            encryptionType: {
              title: 'encryptionType',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'EncryptionType',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'AddPasswordToJob',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'job', 'vault', 'password', 'encryptionType']
    },
    ScheduleEntry: {
      type: 'object',
      title: 'ScheduleEntry',
      required: ['legacy', 'enabled'],
      properties: {
        operation: {
          title: 'operation',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'operation',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        identifier: {
          title: 'identifier',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'identifier',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        legacy: {
          title: 'legacy',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'legacy',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        cycle: {
          title: 'cycle',
          allOf: [
            {
              $ref: '#/definitions/ScheduleCycle'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'cycle',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        options: {
          title: 'options',
          allOf: [
            {
              $ref: '#/definitions/ScheduleOptions'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'options',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        enabled: {
          title: 'enabled',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'enabled',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ScheduleEntry',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['operation', 'identifier', 'legacy', 'cycle', 'options', 'enabled', 'customInfo']
    },
    ArrayOfCommandWithPrompt: {
      type: 'object',
      title: 'ArrayOfCommandWithPrompt',
      properties: {
        commandWithPrompt: {
          title: 'commandWithPrompt',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CommandWithPrompt'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'CommandWithPrompt',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfCommandWithPrompt',
        namespaceURI: ''
      },
      propertiesOrder: ['commandWithPrompt']
    },
    VerifyLog: {
      required: ['checkLatestLog'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyLog',
          properties: {
            logName: {
              title: 'logName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogName',
                namespaceURI: ''
              }
            },
            check: {
              title: 'check',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Check',
                namespaceURI: ''
              }
            },
            checkLatestLog: {
              title: 'checkLatestLog',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CheckLatestLog',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyLog',
        namespaceURI: ''
      },
      propertiesOrder: ['logName', 'check', 'checkLatestLog']
    },
    SuiteVariable: {
      type: 'object',
      title: 'SuiteVariable',
      properties: {
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Name',
            namespaceURI: ''
          }
        },
        value: {
          title: 'value',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Value',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'SuiteVariable',
        namespaceURI: ''
      },
      propertiesOrder: ['name', 'value']
    },
    CopyVaultLogs: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CopyVaultLogs',
          properties: {
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CopyVaultLogs',
        namespaceURI: ''
      },
      propertiesOrder: ['jobName', 'machine']
    },
    ProcessedLog: {
      type: 'object',
      title: 'ProcessedLog',
      properties: {
        filename: {
          title: 'filename',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Filename',
            namespaceURI: ''
          }
        },
        logResult: {
          title: 'logResult',
          allOf: [
            {
              $ref: '#/definitions/LogMatch'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'LogResult',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ProcessedLog',
        namespaceURI: ''
      },
      propertiesOrder: ['filename', 'logResult']
    },
    SleepCondition: {
      type: 'object',
      title: 'SleepCondition',
      properties: {
        seconds: {
          title: 'seconds',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Seconds',
            namespaceURI: ''
          }
        },
        minutes: {
          title: 'minutes',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Minutes',
            namespaceURI: ''
          }
        },
        teamName: {
          title: 'teamName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'TeamName',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'SleepCondition',
        namespaceURI: ''
      },
      propertiesOrder: ['seconds', 'minutes', 'teamName']
    },
    StartRecordingNetworkUsage: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'StartRecordingNetworkUsage',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            counterName: {
              title: 'counterName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CounterName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'StartRecordingNetworkUsage',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'counterName']
    },
    DownloadJobFromAnotherComputer: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DownloadJobFromAnotherComputer',
          properties: {
            sourceAgent: {
              title: 'sourceAgent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SourceAgent',
                namespaceURI: ''
              }
            },
            destinationAgent: {
              title: 'destinationAgent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DestinationAgent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DownloadJobFromAnotherComputer',
        namespaceURI: ''
      },
      propertiesOrder: ['sourceAgent', 'destinationAgent', 'vault', 'jobName']
    },
    StringVariable: {
      allOf: [
        {
          $ref: '#/definitions/VariableOfString'
        },
        {
          type: 'object',
          title: 'StringVariable',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'StringVariable',
        namespaceURI: ''
      }
    },
    JobLogSettings: {
      type: 'object',
      title: 'JobLogSettings',
      required: ['createLog', 'purgeExpiredOnly', 'maxLogCopies'],
      properties: {
        createLog: {
          title: 'createLog',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'createLog',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        level: {
          title: 'level',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'level',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        format: {
          title: 'format',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'format',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        purgeExpiredOnly: {
          title: 'purgeExpiredOnly',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'purgeExpiredOnly',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        maxLogCopies: {
          title: 'maxLogCopies',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'maxLogCopies',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'JobLogSettings',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['createLog', 'level', 'format', 'purgeExpiredOnly', 'maxLogCopies', 'customInfo']
    },
    ArrayOfInt: {
      type: 'object',
      title: 'ArrayOfInt',
      properties: {
        _int: {
          title: '_int',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'int',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfInt',
        namespaceURI: ''
      },
      propertiesOrder: ['_int']
    },
    GenFiles: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'GenFiles',
          properties: {
            percentages: {
              title: 'percentages',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Percentages',
                namespaceURI: ''
              }
            },
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            path: {
              title: 'path',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Path',
                namespaceURI: ''
              }
            },
            totalSizeInKb: {
              title: 'totalSizeInKb',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TotalSizeInKb',
                namespaceURI: ''
              }
            },
            compressible: {
              title: 'compressible',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Compressible',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'GenFiles',
        namespaceURI: ''
      },
      propertiesOrder: ['percentages', 'machine', 'path', 'totalSizeInKb', 'compressible']
    },
    CheckTraceFile: {
      required: ['frequency', 'wholeFile'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckTraceFile',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            message: {
              title: 'message',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Message',
                namespaceURI: ''
              }
            },
            nextMessage: {
              title: 'nextMessage',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NextMessage',
                namespaceURI: ''
              }
            },
            traceLog: {
              title: 'traceLog',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TraceLog',
                namespaceURI: ''
              }
            },
            frequency: {
              title: 'frequency',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Frequency',
                namespaceURI: ''
              }
            },
            wholeFile: {
              title: 'wholeFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'WholeFile',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckTraceFile',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'message', 'nextMessage', 'traceLog', 'frequency', 'wholeFile']
    },
    PrepareForExchangeVSSRestore: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'PrepareForExchangeVSSRestore',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            dbName: {
              title: 'dbName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DBName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'PrepareForExchangeVSSRestore',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'dbName']
    },
    CompareHashLogs: {
      allOf: [
        {
          $ref: '#/definitions/RemoteSystemCommand'
        },
        {
          type: 'object',
          title: 'CompareHashLogs',
          properties: {
            log1: {
              title: 'log1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Log1',
                namespaceURI: ''
              }
            },
            log2: {
              title: 'log2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Log2',
                namespaceURI: ''
              }
            },
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            logFolder: {
              title: 'logFolder',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogFolder',
                namespaceURI: ''
              }
            },
            hashlogFolder: {
              title: 'hashlogFolder',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'HashlogFolder',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CompareHashLogs',
        namespaceURI: ''
      },
      propertiesOrder: ['log1', 'log2', 'machine', 'logFolder', 'hashlogFolder']
    },
    CalculateFileHash: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CalculateFileHash',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            method: {
              title: 'method',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Method',
                namespaceURI: ''
              }
            },
            saveHashTo: {
              title: 'saveHashTo',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SaveHashTo',
                namespaceURI: ''
              }
            },
            saveVersionTo: {
              title: 'saveVersionTo',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SaveVersionTo',
                namespaceURI: ''
              }
            },
            path: {
              title: 'path',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Path',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CalculateFileHash',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'method', 'saveHashTo', 'saveVersionTo', 'path']
    },
    CopyFiles: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CopyFiles',
          properties: {
            source: {
              title: 'source',
              allOf: [
                {
                  $ref: '#/definitions/MachinePath'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Source',
                namespaceURI: ''
              }
            },
            destination: {
              title: 'destination',
              allOf: [
                {
                  $ref: '#/definitions/MachinePath'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Destination',
                namespaceURI: ''
              }
            },
            files: {
              title: 'files',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Files',
                namespaceURI: ''
              }
            },
            retryLimit: {
              title: 'retryLimit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'RetryLimit',
                namespaceURI: ''
              }
            },
            retryTimeout: {
              title: 'retryTimeout',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'RetryTimeout',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CopyFiles',
        namespaceURI: ''
      },
      propertiesOrder: ['source', 'destination', 'files', 'retryLimit', 'retryTimeout']
    },
    ArrayOfParameter: {
      type: 'object',
      title: 'ArrayOfParameter',
      properties: {
        parameter: {
          title: 'parameter',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Parameter'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Parameter',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfParameter',
        namespaceURI: ''
      },
      propertiesOrder: ['parameter']
    },
    VerifyLogHasSmallExchangeDelta: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyLogHasSmallExchangeDelta',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyLogHasSmallExchangeDelta',
        namespaceURI: ''
      },
      propertiesOrder: ['agent']
    },
    TeamConnectivity: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'TeamConnectivity',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'TeamConnectivity',
        namespaceURI: ''
      }
    },
    ArrayOfSuite: {
      type: 'object',
      title: 'ArrayOfSuite',
      properties: {
        suite: {
          title: 'suite',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Suite'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Suite',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfSuite',
        namespaceURI: ''
      },
      propertiesOrder: ['suite']
    },
    CheckVMDiskProvisionType: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckVMDiskProvisionType',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            provisionType: {
              title: 'provisionType',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ProvisionType',
                namespaceURI: ''
              }
            },
            hardDriveNo: {
              title: 'hardDriveNo',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'HardDriveNo',
                namespaceURI: ''
              }
            },
            vSphereServer: {
              title: 'vSphereServer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'vSphereServer',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckVMDiskProvisionType',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'provisionType', 'hardDriveNo', 'vSphereServer']
    },
    DeleteFiles: {
      required: ['deleteSubFolders'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DeleteFiles',
          properties: {
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: '#/definitions/Machine'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            },
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: '#/definitions/MachinePath'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            files: {
              title: 'files',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Files',
                namespaceURI: ''
              }
            },
            retryLimit: {
              title: 'retryLimit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'RetryLimit',
                namespaceURI: ''
              }
            },
            retryTimeout: {
              title: 'retryTimeout',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'RetryTimeout',
                namespaceURI: ''
              }
            },
            deleteSubFolders: {
              title: 'deleteSubFolders',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DeleteSubFolders',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DeleteFiles',
        namespaceURI: ''
      },
      propertiesOrder: ['targetMachine', 'target', 'files', 'retryLimit', 'retryTimeout', 'deleteSubFolders']
    },
    VariableList: {
      type: 'object',
      title: 'VariableList',
      required: ['any'],
      properties: {
        any: {
          title: 'any',
          allOf: [
            {
              type: 'object',
              properties: {
                name: {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
                },
                value: {}
              }
            }
          ],
          propertyType: 'anyElement'
        }
      },
      typeType: 'classInfo',
      propertiesOrder: ['any']
    },
    MachineOp: {
      required: ['action', 'cleanup'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'MachineOp',
          properties: {
            action: {
              title: 'action',
              allOf: [
                {
                  $ref: '#/definitions/ActionType'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Action',
                namespaceURI: ''
              }
            },
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            cleanup: {
              title: 'cleanup',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Cleanup',
                namespaceURI: ''
              }
            },
            extraDeployOptions: {
              title: 'extraDeployOptions',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExtraDeployOptions',
                namespaceURI: ''
              }
            },
            diskStorageFormat: {
              title: 'diskStorageFormat',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DiskStorageFormat',
                namespaceURI: ''
              }
            },
            datastore: {
              title: 'datastore',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Datastore',
                namespaceURI: ''
              }
            },
            template: {
              title: 'template',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Template',
                namespaceURI: ''
              }
            },
            vApp: {
              title: 'vApp',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'vApp',
                namespaceURI: ''
              }
            },
            hasRestoredSuffix: {
              title: 'hasRestoredSuffix',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'HasRestoredSuffix',
                namespaceURI: ''
              }
            },
            snapshotName: {
              title: 'snapshotName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SnapshotName',
                namespaceURI: ''
              }
            },
            snapshotDescription: {
              title: 'snapshotDescription',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SnapshotDescription',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'MachineOp',
        namespaceURI: ''
      },
      propertiesOrder: [
        'action',
        'target',
        'cleanup',
        'extraDeployOptions',
        'diskStorageFormat',
        'datastore',
        'template',
        'vApp',
        'hasRestoredSuffix',
        'snapshotName',
        'snapshotDescription'
      ]
    },
    RegisterAgent: {
      required: ['existingComputer'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RegisterAgent',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            existingComputer: {
              title: 'existingComputer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExistingComputer',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RegisterAgent',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'vault', 'existingComputer', 'portalMachine']
    },
    DeleteEmails: {
      required: ['mailboxSizeAfterDeletion'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DeleteEmails',
          properties: {
            exMachine: {
              title: 'exMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExMachine',
                namespaceURI: ''
              }
            },
            forUserName: {
              title: 'forUserName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ForUserName',
                namespaceURI: ''
              }
            },
            searchQuery: {
              title: 'searchQuery',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SearchQuery',
                namespaceURI: ''
              }
            },
            mailboxSizeAfterDeletion: {
              title: 'mailboxSizeAfterDeletion',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'MailboxSizeAfterDeletion',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DeleteEmails',
        namespaceURI: ''
      },
      propertiesOrder: ['exMachine', 'forUserName', 'searchQuery', 'mailboxSizeAfterDeletion']
    },
    EWSDelete: {
      required: ['deleteType', 'rootFolder', 'emptySubfolders', 'deleteSubfolders'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'EWSDelete',
          properties: {
            onMachine: {
              title: 'onMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnMachine',
                namespaceURI: ''
              }
            },
            deleteType: {
              title: 'deleteType',
              allOf: [
                {
                  $ref: '#/definitions/EWSDeleteType'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DeleteType',
                namespaceURI: ''
              }
            },
            rootFolder: {
              title: 'rootFolder',
              allOf: [
                {
                  $ref: '#/definitions/RootFolderType'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RootFolder',
                namespaceURI: ''
              }
            },
            folderNameToDelete: {
              title: 'folderNameToDelete',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FolderNameToDelete',
                namespaceURI: ''
              }
            },
            parentFolderName: {
              title: 'parentFolderName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ParentFolderName',
                namespaceURI: ''
              }
            },
            user: {
              title: 'user',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'User',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            },
            itemSubject: {
              title: 'itemSubject',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ItemSubject',
                namespaceURI: ''
              }
            },
            emptySubfolders: {
              title: 'emptySubfolders',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'EmptySubfolders',
                namespaceURI: ''
              }
            },
            deleteSubfolders: {
              title: 'deleteSubfolders',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DeleteSubfolders',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'EWSDelete',
        namespaceURI: ''
      },
      propertiesOrder: [
        'onMachine',
        'deleteType',
        'rootFolder',
        'folderNameToDelete',
        'parentFolderName',
        'user',
        'password',
        'itemSubject',
        'emptySubfolders',
        'deleteSubfolders'
      ]
    },
    ArrayOfString: {
      type: 'object',
      title: 'ArrayOfString',
      properties: {
        string: {
          title: 'string',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'string',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfString',
        namespaceURI: ''
      },
      propertiesOrder: ['string']
    },
    FileExists: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'FileExists',
          properties: {
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: '#/definitions/MachinePath'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: '#/definitions/Machine'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            },
            files: {
              title: 'files',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Files',
                namespaceURI: ''
              }
            },
            logic: {
              title: 'logic',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Logic',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'FileExists',
        namespaceURI: ''
      },
      propertiesOrder: ['target', 'targetMachine', 'files', 'logic']
    },
    ComparePSAttributeToString: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ComparePSAttributeToString',
          properties: {
            powershellCommand: {
              title: 'powershellCommand',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PowershellCommand',
                namespaceURI: ''
              }
            },
            comparisonString: {
              title: 'comparisonString',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ComparisonString',
                namespaceURI: ''
              }
            },
            vSphereServer: {
              title: 'vSphereServer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'vSphereServer',
                namespaceURI: ''
              }
            },
            username: {
              title: 'username',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Username',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            },
            targetVM: {
              title: 'targetVM',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetVM',
                namespaceURI: ''
              }
            },
            vMname: {
              title: 'vMname',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VMname',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ComparePSAttributeToString',
        namespaceURI: ''
      },
      propertiesOrder: [
        'powershellCommand',
        'comparisonString',
        'vSphereServer',
        'username',
        'password',
        'targetVM',
        'vMname'
      ]
    },
    Mount: {
      required: ['safeSetID', 'wait', 'diskNumber'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Mount',
          properties: {
            optionsFile: {
              title: 'optionsFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'OptionsFile',
                namespaceURI: ''
              }
            },
            options: {
              title: 'options',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfRestoreOptions'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Options',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            safeSetID: {
              title: 'safeSetID',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/unsignedInt'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SafeSetID',
                namespaceURI: ''
              }
            },
            testVM: {
              title: 'testVM',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TestVM',
                namespaceURI: ''
              }
            },
            shareUser: {
              title: 'shareUser',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'shareUser',
                namespaceURI: ''
              }
            },
            sharePassword: {
              title: 'sharePassword',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'sharePassword',
                namespaceURI: ''
              }
            },
            mountTimeout: {
              title: 'mountTimeout',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'mountTimeout',
                namespaceURI: ''
              }
            },
            wait: {
              title: 'wait',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Wait',
                namespaceURI: ''
              }
            },
            diskNumber: {
              title: 'diskNumber',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DiskNumber',
                namespaceURI: ''
              }
            },
            diskPathAndName: {
              title: 'diskPathAndName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DiskPathAndName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Mount',
        namespaceURI: ''
      },
      propertiesOrder: [
        'optionsFile',
        'options',
        'agent',
        'jobName',
        'safeSetID',
        'testVM',
        'shareUser',
        'sharePassword',
        'mountTimeout',
        'wait',
        'diskNumber',
        'diskPathAndName'
      ]
    },
    CloneFiles: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CloneFiles',
          properties: {
            location: {
              title: 'location',
              allOf: [
                {
                  $ref: '#/definitions/MachinePath'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Location',
                namespaceURI: ''
              }
            },
            files: {
              title: 'files',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfFilePair'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Files',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CloneFiles',
        namespaceURI: ''
      },
      propertiesOrder: ['location', 'files']
    },
    CountSafesetsOnAgent: {
      required: ['expectedNumberOfSafesets'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CountSafesetsOnAgent',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            expectedNumberOfSafesets: {
              title: 'expectedNumberOfSafesets',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedNumberOfSafesets',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CountSafesetsOnAgent',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'jobName', 'expectedNumberOfSafesets']
    },
    RunSQLQuery: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RunSQLQuery',
          properties: {
            sqlServer: {
              title: 'sqlServer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SQLServer',
                namespaceURI: ''
              }
            },
            user: {
              title: 'user',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'User',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            },
            queryFile: {
              title: 'queryFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'QueryFile',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RunSQLQuery',
        namespaceURI: ''
      },
      propertiesOrder: ['sqlServer', 'user', 'password', 'queryFile']
    },
    AgentInfo: {
      type: 'object',
      title: 'AgentInfo',
      required: ['mode'],
      properties: {
        serviceName: {
          title: 'serviceName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ServiceName',
            namespaceURI: ''
          }
        },
        mode: {
          title: 'mode',
          allOf: [
            {
              $ref: '#/definitions/Modes'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Mode',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'AgentInfo',
        namespaceURI: ''
      },
      propertiesOrder: ['serviceName', 'mode']
    },
    ExpectedLogMatches: {
      type: 'object',
      title: 'ExpectedLogMatches',
      properties: {
        logMatch: {
          title: 'logMatch',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/LogMatch'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'LogMatch',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ExpectedLogMatches',
        namespaceURI: ''
      },
      propertiesOrder: ['logMatch']
    },
    JobConfig: {
      type: 'object',
      title: 'JobConfig',
      required: ['nativeJob', 'allCommonFilters'],
      properties: {
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'name',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        description: {
          title: 'description',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'description',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        type: {
          title: 'type',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'type',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        jobId: {
          title: 'jobId',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'jobId',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        nativeJob: {
          title: 'nativeJob',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'nativeJob',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        computerName: {
          title: 'computerName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'computerName',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        vaultComputerId: {
          title: 'vaultComputerId',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'vaultComputerId',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        originalVault: {
          title: 'originalVault',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'originalVault',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        commonFilters: {
          title: 'commonFilters',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'commonFilters',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        allCommonFilters: {
          title: 'allCommonFilters',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'allCommonFilters',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        sources: {
          title: 'sources',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/JobSource'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'sources',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        processing: {
          title: 'processing',
          allOf: [
            {
              $ref: '#/definitions/JobProcessing'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'processing',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        encryption: {
          title: 'encryption',
          allOf: [
            {
              $ref: '#/definitions/JobEncryption'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'encryption',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        log: {
          title: 'log',
          allOf: [
            {
              $ref: '#/definitions/JobLogSettings'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'log',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        tape: {
          title: 'tape',
          allOf: [
            {
              $ref: '#/definitions/JobTapeSettings'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'tape',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        scheduleLoaded: {
          title: 'scheduleLoaded',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'scheduleLoaded',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        schedule: {
          title: 'schedule',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/ScheduleEntry'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'schedule',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        signature: {
          title: 'signature',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'signature',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        local: {
          title: 'local',
          allOf: [
            {
              $ref: '#/definitions/JobConfigLocal'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'local',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        mSignature: {
          title: 'mSignature',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'm-signature',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        mScheduleSignature: {
          title: 'mScheduleSignature',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'm-scheduleSignature',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'JobConfig',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: [
        'name',
        'description',
        'type',
        'jobId',
        'nativeJob',
        'computerName',
        'vaultComputerId',
        'originalVault',
        'commonFilters',
        'allCommonFilters',
        'sources',
        'processing',
        'encryption',
        'log',
        'tape',
        'scheduleLoaded',
        'schedule',
        'signature',
        'local',
        'customInfo',
        'mSignature',
        'mScheduleSignature'
      ]
    },
    ArrayOfSleepCondition: {
      type: 'object',
      title: 'ArrayOfSleepCondition',
      properties: {
        sleepCondition: {
          title: 'sleepCondition',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/SleepCondition'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'SleepCondition',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfSleepCondition',
        namespaceURI: ''
      },
      propertiesOrder: ['sleepCondition']
    },
    LogMatch: {
      type: 'object',
      title: 'LogMatch',
      required: ['patternType', 'count'],
      properties: {
        resultType: {
          title: 'resultType',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'ResultType',
            namespaceURI: ''
          }
        },
        pattern: {
          title: 'pattern',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Pattern',
            namespaceURI: ''
          }
        },
        patternType: {
          title: 'patternType',
          allOf: [
            {
              $ref: '#/definitions/PatternTypes'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'PatternType',
            namespaceURI: ''
          }
        },
        lineText: {
          title: 'lineText',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'LineText',
            namespaceURI: ''
          }
        },
        count: {
          title: 'count',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Count',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'LogMatch',
        namespaceURI: ''
      },
      propertiesOrder: ['resultType', 'pattern', 'patternType', 'lineText', 'count']
    },
    MakeScriptRunnable: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'MakeScriptRunnable',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'MakeScriptRunnable',
        namespaceURI: ''
      },
      propertiesOrder: ['machine']
    },
    TeamMachineOp: {
      required: ['action', 'initializationCheckMaxRetries', 'initializationCheckRetrySleepSeconds'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'TeamMachineOp',
          properties: {
            action: {
              title: 'action',
              allOf: [
                {
                  $ref: '#/definitions/TeamActionType'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Action',
                namespaceURI: ''
              }
            },
            initializationCheckCommand: {
              title: 'initializationCheckCommand',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'InitializationCheckCommand',
                namespaceURI: ''
              }
            },
            initializationCheckArguments: {
              title: 'initializationCheckArguments',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'InitializationCheckArguments',
                namespaceURI: ''
              }
            },
            initializationCheckExitCode: {
              title: 'initializationCheckExitCode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'InitializationCheckExitCode',
                namespaceURI: ''
              }
            },
            initializationCheckMaxRetries: {
              title: 'initializationCheckMaxRetries',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'InitializationCheckMaxRetries',
                namespaceURI: ''
              }
            },
            initializationCheckRetrySleepSeconds: {
              title: 'initializationCheckRetrySleepSeconds',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'InitializationCheckRetrySleepSeconds',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'TeamMachineOp',
        namespaceURI: ''
      },
      propertiesOrder: [
        'action',
        'initializationCheckCommand',
        'initializationCheckArguments',
        'initializationCheckExitCode',
        'initializationCheckMaxRetries',
        'initializationCheckRetrySleepSeconds'
      ]
    },
    FindInFile: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'FindInFile',
          properties: {
            searchStrings: {
              title: 'searchStrings',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'SearchStrings',
                namespaceURI: ''
              }
            },
            isCaseSensitive: {
              title: 'isCaseSensitive',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IsCaseSensitive',
                namespaceURI: ''
              }
            },
            filePathAndName: {
              title: 'filePathAndName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePathAndName',
                namespaceURI: ''
              }
            },
            logic: {
              title: 'logic',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Logic',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'FindInFile',
        namespaceURI: ''
      },
      propertiesOrder: ['searchStrings', 'isCaseSensitive', 'filePathAndName', 'logic']
    },
    CheckFileForString: {
      required: ['shouldExist'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckFileForString',
          properties: {
            psGetSearchText: {
              title: 'psGetSearchText',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'PSGetSearchText',
                namespaceURI: ''
              }
            },
            resolvedPath: {
              title: 'resolvedPath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'resolvedPath',
                namespaceURI: ''
              }
            },
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            file: {
              title: 'file',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'File',
                namespaceURI: ''
              }
            },
            searchText: {
              title: 'searchText',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SearchText',
                namespaceURI: ''
              }
            },
            shouldExist: {
              title: 'shouldExist',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ShouldExist',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckFileForString',
        namespaceURI: ''
      },
      propertiesOrder: ['psGetSearchText', 'resolvedPath', 'machine', 'file', 'searchText', 'shouldExist']
    },
    CopyLogs: {
      required: ['deleteOldLogs'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CopyLogs',
          properties: {
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            logMask: {
              title: 'logMask',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogMask',
                namespaceURI: ''
              }
            },
            traceMask: {
              title: 'traceMask',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TraceMask',
                namespaceURI: ''
              }
            },
            deleteOldLogs: {
              title: 'deleteOldLogs',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DeleteOldLogs',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            },
            activeNode: {
              title: 'activeNode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ActiveNode',
                namespaceURI: ''
              }
            },
            subDir: {
              title: 'subDir',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SubDir',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CopyLogs',
        namespaceURI: ''
      },
      propertiesOrder: [
        'jobName',
        'machine',
        'logMask',
        'traceMask',
        'deleteOldLogs',
        'portalMachine',
        'activeNode',
        'subDir'
      ]
    },
    TimeLimit: {
      type: 'object',
      title: 'TimeLimit',
      required: ['timeout', 'retries', 'sleep'],
      properties: {
        timeout: {
          title: 'timeout',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Timeout',
            namespaceURI: ''
          }
        },
        retries: {
          title: 'retries',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Retries',
            namespaceURI: ''
          }
        },
        sleep: {
          title: 'sleep',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Sleep',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'TimeLimit',
        namespaceURI: ''
      },
      propertiesOrder: ['timeout', 'retries', 'sleep']
    },
    DateFilter: {
      type: 'object',
      title: 'DateFilter',
      properties: {
        from: {
          title: 'from',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'from',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        to: {
          title: 'to',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'to',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        type: {
          title: 'type',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'type',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'DateFilter',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['from', 'to', 'type', 'customInfo']
    },
    FilePair: {
      type: 'object',
      title: 'FilePair',
      properties: {
        source: {
          title: 'source',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Source',
            namespaceURI: ''
          }
        },
        destination: {
          title: 'destination',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Destination',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'FilePair',
        namespaceURI: ''
      },
      propertiesOrder: ['source', 'destination']
    },
    ArrayOfSourceOverride: {
      type: 'object',
      title: 'ArrayOfSourceOverride',
      properties: {
        sourceOverride: {
          title: 'sourceOverride',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/SourceOverride'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'SourceOverride',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfSourceOverride',
        namespaceURI: ''
      },
      propertiesOrder: ['sourceOverride']
    },
    RemoteSystemCommand: {
      required: ['runAsSystemAccount'],
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'RemoteSystemCommand',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            runAsSystemAccount: {
              title: 'runAsSystemAccount',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RunAsSystemAccount',
                namespaceURI: ''
              }
            },
            conditionalArguments: {
              title: 'conditionalArguments',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ConditionalArguments',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RemoteSystemCommand',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'runAsSystemAccount', 'conditionalArguments']
    },
    ArrayOfPSMemberInfo: {
      type: 'object',
      title: 'ArrayOfPSMemberInfo',
      properties: {
        psMemberInfo: {
          title: 'psMemberInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/PSMemberInfo'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'PSMemberInfo',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfPSMemberInfo',
        namespaceURI: ''
      },
      propertiesOrder: ['psMemberInfo']
    },
    CommandWithPrompt: {
      type: 'object',
      title: 'CommandWithPrompt',
      properties: {
        prompt: {
          title: 'prompt',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Prompt',
            namespaceURI: ''
          }
        },
        command: {
          title: 'command',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Command',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'CommandWithPrompt',
        namespaceURI: ''
      },
      propertiesOrder: ['prompt', 'command']
    },
    SyncSatelliteVault: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'SyncSatelliteVault',
          properties: {
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SyncSatelliteVault',
        namespaceURI: ''
      },
      propertiesOrder: ['vault']
    },
    ArrayOfPSMethodInfo: {
      type: 'object',
      title: 'ArrayOfPSMethodInfo',
      properties: {
        psMethodInfo: {
          title: 'psMethodInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/PSMethodInfo'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'PSMethodInfo',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfPSMethodInfo',
        namespaceURI: ''
      },
      propertiesOrder: ['psMethodInfo']
    },
    ArrayOfFilePair: {
      type: 'object',
      title: 'ArrayOfFilePair',
      properties: {
        filePair: {
          title: 'filePair',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/FilePair'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'FilePair',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfFilePair',
        namespaceURI: ''
      },
      propertiesOrder: ['filePair']
    },
    Pause: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Pause',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Pause',
        namespaceURI: ''
      }
    },
    'Team.Machines': {
      type: 'object',
      title: 'Team.Machines',
      required: ['any'],
      properties: {
        any: {
          title: 'any',
          allOf: [
            {
              type: 'object',
              properties: {
                name: {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
                },
                value: {}
              }
            }
          ],
          propertyType: 'anyElement'
        }
      },
      typeType: 'classInfo',
      propertiesOrder: ['any']
    },
    ChangeDate: {
      required: ['days'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ChangeDate',
          properties: {
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            },
            goBackwardForward: {
              title: 'goBackwardForward',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'GoBackwardForward',
                namespaceURI: ''
              }
            },
            days: {
              title: 'days',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Days',
                namespaceURI: ''
              }
            },
            customDate: {
              title: 'customDate',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CustomDate',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ChangeDate',
        namespaceURI: ''
      },
      propertiesOrder: ['targetMachine', 'goBackwardForward', 'days', 'customDate']
    },
    Hasher: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'Hasher',
          properties: {
            logName: {
              title: 'logName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogName',
                namespaceURI: ''
              }
            },
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            unixArguments: {
              title: 'unixArguments',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UnixArguments',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Hasher',
        namespaceURI: ''
      },
      propertiesOrder: ['logName', 'machine', 'unixArguments']
    },
    ArrayOfRestoreOptions: {
      type: 'object',
      title: 'ArrayOfRestoreOptions',
      properties: {
        restoreOptions: {
          title: 'restoreOptions',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/RestoreOptions'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'RestoreOptions',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfRestoreOptions',
        namespaceURI: ''
      },
      propertiesOrder: ['restoreOptions']
    },
    Volume: {
      type: 'object',
      title: 'Volume',
      properties: {
        driveLetter: {
          title: 'driveLetter',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'DriveLetter',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Volume',
        namespaceURI: ''
      },
      propertiesOrder: ['driveLetter']
    },
    VerifyState: {
      required: ['action', 'saveLog'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyState',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            action: {
              title: 'action',
              allOf: [
                {
                  $ref: '#/definitions/VerifyStateActions'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Action',
                namespaceURI: ''
              }
            },
            saveLog: {
              title: 'saveLog',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SaveLog',
                namespaceURI: ''
              }
            },
            logName: {
              title: 'logName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyState',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'action', 'saveLog', 'logName']
    },
    VerifyAllLogsForErrors: {
      required: ['restorePassCount'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyAllLogsForErrors',
          properties: {
            restorePassCount: {
              title: 'restorePassCount',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RestorePassCount',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyAllLogsForErrors',
        namespaceURI: ''
      },
      propertiesOrder: ['restorePassCount']
    },
    WaitForVMSnapshots: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'WaitForVMSnapshots',
          properties: {
            displayName: {
              title: 'displayName',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'DisplayName',
                namespaceURI: ''
              }
            },
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            vSphereServer: {
              title: 'vSphereServer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'vSphereServer',
                namespaceURI: ''
              }
            },
            username: {
              title: 'username',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Username',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            },
            lessThan: {
              title: 'lessThan',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LessThan',
                namespaceURI: ''
              }
            },
            timeOut: {
              title: 'timeOut',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TimeOut',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'WaitForVMSnapshots',
        namespaceURI: ''
      },
      propertiesOrder: ['displayName', 'remoteMachine', 'vSphereServer', 'username', 'password', 'lessThan', 'timeOut']
    },
    SQLDataCompare: {
      required: ['iHaveAConfigFile', 'displayLog'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'SQLDataCompare',
          properties: {
            iHaveAConfigFile: {
              title: 'iHaveAConfigFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IHaveAConfigFile',
                namespaceURI: ''
              }
            },
            sqlServer1: {
              title: 'sqlServer1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SQLServer1',
                namespaceURI: ''
              }
            },
            user1: {
              title: 'user1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'User1',
                namespaceURI: ''
              }
            },
            password1: {
              title: 'password1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password1',
                namespaceURI: ''
              }
            },
            db1: {
              title: 'db1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DB1',
                namespaceURI: ''
              }
            },
            sqlServer2: {
              title: 'sqlServer2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SQLServer2',
                namespaceURI: ''
              }
            },
            user2: {
              title: 'user2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'User2',
                namespaceURI: ''
              }
            },
            password2: {
              title: 'password2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password2',
                namespaceURI: ''
              }
            },
            db2: {
              title: 'db2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DB2',
                namespaceURI: ''
              }
            },
            configFile: {
              title: 'configFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ConfigFile',
                namespaceURI: ''
              }
            },
            logName: {
              title: 'logName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogName',
                namespaceURI: ''
              }
            },
            displayLog: {
              title: 'displayLog',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DisplayLog',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SQLDataCompare',
        namespaceURI: ''
      },
      propertiesOrder: [
        'iHaveAConfigFile',
        'sqlServer1',
        'user1',
        'password1',
        'db1',
        'sqlServer2',
        'user2',
        'password2',
        'db2',
        'configFile',
        'logName',
        'displayLog'
      ]
    },
    Variable: {
      type: 'object',
      title: 'Variable',
      properties: {
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Name',
            namespaceURI: ''
          }
        },
        value: {
          title: 'value',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Value',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Variable',
        namespaceURI: ''
      },
      propertiesOrder: ['name', 'value']
    },
    VerifyExchangeVSSHardRecovery: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyExchangeVSSHardRecovery',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            dbName: {
              title: 'dbName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DBName',
                namespaceURI: ''
              }
            },
            expectedResultCount: {
              title: 'expectedResultCount',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedResultCount',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyExchangeVSSHardRecovery',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'dbName', 'expectedResultCount']
    },
    CheckMailboxSize: {
      required: ['expectedSize'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckMailboxSize',
          properties: {
            onMachine: {
              title: 'onMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnMachine',
                namespaceURI: ''
              }
            },
            userName: {
              title: 'userName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UserName',
                namespaceURI: ''
              }
            },
            expectedSize: {
              title: 'expectedSize',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedSize',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckMailboxSize',
        namespaceURI: ''
      },
      propertiesOrder: ['onMachine', 'userName', 'expectedSize']
    },
    RemoveTemplate: {
      required: ['cleanup'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RemoveTemplate',
          properties: {
            fromMachine: {
              title: 'fromMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FromMachine',
                namespaceURI: ''
              }
            },
            name: {
              title: 'name',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Name',
                namespaceURI: ''
              }
            },
            server: {
              title: 'server',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Server',
                namespaceURI: ''
              }
            },
            userName: {
              title: 'userName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UserName',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            },
            container: {
              title: 'container',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Container',
                namespaceURI: ''
              }
            },
            cleanup: {
              title: 'cleanup',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Cleanup',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RemoveTemplate',
        namespaceURI: ''
      },
      propertiesOrder: ['fromMachine', 'name', 'server', 'userName', 'password', 'container', 'cleanup']
    },
    RunVaultOperation: {
      required: ['vaultOp'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RunVaultOperation',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            vaultOp: {
              title: 'vaultOp',
              allOf: [
                {
                  $ref: '#/definitions/VaultOperation'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VaultOp',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RunVaultOperation',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'vault', 'jobName', 'vaultOp']
    },
    InstallHyperVManagement: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'InstallHyperVManagement',
          properties: {
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            },
            installType: {
              title: 'installType',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'InstallType',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            },
            uiregport: {
              title: 'uiregport',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UIREG_PORT',
                namespaceURI: ''
              }
            },
            installdir: {
              title: 'installdir',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'INSTALLDIR',
                namespaceURI: ''
              }
            },
            log: {
              title: 'log',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LOG',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'InstallHyperVManagement',
        namespaceURI: ''
      },
      propertiesOrder: ['targetMachine', 'installType', 'portalMachine', 'uiregport', 'installdir', 'log']
    },
    Queue: {
      required: ['override'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Queue',
          properties: {
            commands: {
              title: 'commands',
              allOf: [
                {
                  $ref: '#/definitions/CommandList'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Commands',
                namespaceURI: ''
              }
            },
            name: {
              title: 'name',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Name',
                namespaceURI: ''
              }
            },
            override: {
              title: 'override',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Override',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Queue',
        namespaceURI: ''
      },
      propertiesOrder: ['commands', 'name', 'override']
    },
    ArrayOfPSObject: {
      type: 'object',
      title: 'ArrayOfPSObject',
      properties: {
        psObject: {
          title: 'psObject',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/PSObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'PSObject',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfPSObject',
        namespaceURI: ''
      },
      propertiesOrder: ['psObject']
    },
    'Machine.Credentials': {
      type: 'object',
      title: 'Machine.Credentials',
      required: ['any'],
      properties: {
        any: {
          title: 'any',
          allOf: [
            {
              type: 'object',
              properties: {
                name: {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
                },
                value: {}
              }
            }
          ],
          propertyType: 'anyElement'
        }
      },
      typeType: 'classInfo',
      propertiesOrder: ['any']
    },
    Credential: {
      type: 'object',
      title: 'Credential',
      required: ['consumer'],
      properties: {
        extra: {
          title: 'extra',
          allOf: [
            {
              $ref: '#/definitions/Credential.Extra'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Extra',
            namespaceURI: ''
          }
        },
        consumer: {
          title: 'consumer',
          allOf: [
            {
              $ref: '#/definitions/CredentialConsumer'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Consumer',
            namespaceURI: ''
          }
        },
        username: {
          title: 'username',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Username',
            namespaceURI: ''
          }
        },
        password: {
          title: 'password',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Password',
            namespaceURI: ''
          }
        },
        domain: {
          title: 'domain',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Domain',
            namespaceURI: ''
          }
        },
        profile: {
          title: 'profile',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Profile',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Credential',
        namespaceURI: ''
      },
      propertiesOrder: ['extra', 'consumer', 'username', 'password', 'domain', 'profile']
    },
    UnsignedIntegerVariable: {
      allOf: [
        {
          $ref: '#/definitions/VariableOfUInt32'
        },
        {
          type: 'object',
          title: 'UnsignedIntegerVariable',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'UnsignedIntegerVariable',
        namespaceURI: ''
      }
    },
    ArrayOfMessage: {
      type: 'object',
      title: 'ArrayOfMessage',
      properties: {
        message: {
          title: 'message',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Message'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Message',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfMessage',
        namespaceURI: ''
      },
      propertiesOrder: ['message']
    },
    MachineReboot: {
      required: [
        'setupWaitForExit',
        'setupRetries',
        'setupRetrySleep',
        'runSetupCommand',
        'teardownWaitForExit',
        'teardownRetries',
        'teardownRetrySleep',
        'runTeardownCommand',
        'rebootWaitForExit',
        'rebootRetries',
        'rebootRetrySleep',
        'offlineRetries',
        'offlineRetrySleep',
        'onlineRetries',
        'onlineRetrySleep',
        'waitOffline',
        'waitOnline'
      ],
      allOf: [
        {
          $ref: '#/definitions/RemoteSystemCommand'
        },
        {
          type: 'object',
          title: 'MachineReboot',
          properties: {
            remoteMachineAfterReboot: {
              title: 'remoteMachineAfterReboot',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachineAfterReboot',
                namespaceURI: ''
              }
            },
            setupCommand: {
              title: 'setupCommand',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SetupCommand',
                namespaceURI: ''
              }
            },
            setupArguments: {
              title: 'setupArguments',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SetupArguments',
                namespaceURI: ''
              }
            },
            setupWaitForExit: {
              title: 'setupWaitForExit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SetupWaitForExit',
                namespaceURI: ''
              }
            },
            setupExitCode: {
              title: 'setupExitCode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SetupExitCode',
                namespaceURI: ''
              }
            },
            setupRetries: {
              title: 'setupRetries',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SetupRetries',
                namespaceURI: ''
              }
            },
            setupRetrySleep: {
              title: 'setupRetrySleep',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SetupRetrySleep',
                namespaceURI: ''
              }
            },
            runSetupCommand: {
              title: 'runSetupCommand',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RunSetupCommand',
                namespaceURI: ''
              }
            },
            teardownCommand: {
              title: 'teardownCommand',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TeardownCommand',
                namespaceURI: ''
              }
            },
            teardownArguments: {
              title: 'teardownArguments',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TeardownArguments',
                namespaceURI: ''
              }
            },
            teardownWaitForExit: {
              title: 'teardownWaitForExit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TeardownWaitForExit',
                namespaceURI: ''
              }
            },
            teardownExitCode: {
              title: 'teardownExitCode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TeardownExitCode',
                namespaceURI: ''
              }
            },
            teardownRetries: {
              title: 'teardownRetries',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TeardownRetries',
                namespaceURI: ''
              }
            },
            teardownRetrySleep: {
              title: 'teardownRetrySleep',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TeardownRetrySleep',
                namespaceURI: ''
              }
            },
            runTeardownCommand: {
              title: 'runTeardownCommand',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RunTeardownCommand',
                namespaceURI: ''
              }
            },
            rebootCommand: {
              title: 'rebootCommand',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RebootCommand',
                namespaceURI: ''
              }
            },
            rebootArguments: {
              title: 'rebootArguments',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RebootArguments',
                namespaceURI: ''
              }
            },
            rebootWaitForExit: {
              title: 'rebootWaitForExit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RebootWaitForExit',
                namespaceURI: ''
              }
            },
            rebootExitCode: {
              title: 'rebootExitCode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RebootExitCode',
                namespaceURI: ''
              }
            },
            rebootRetries: {
              title: 'rebootRetries',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RebootRetries',
                namespaceURI: ''
              }
            },
            rebootRetrySleep: {
              title: 'rebootRetrySleep',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RebootRetrySleep',
                namespaceURI: ''
              }
            },
            offlineRetries: {
              title: 'offlineRetries',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OfflineRetries',
                namespaceURI: ''
              }
            },
            offlineRetrySleep: {
              title: 'offlineRetrySleep',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OfflineRetrySleep',
                namespaceURI: ''
              }
            },
            onlineRetries: {
              title: 'onlineRetries',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnlineRetries',
                namespaceURI: ''
              }
            },
            onlineRetrySleep: {
              title: 'onlineRetrySleep',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnlineRetrySleep',
                namespaceURI: ''
              }
            },
            waitOffline: {
              title: 'waitOffline',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'WaitOffline',
                namespaceURI: ''
              }
            },
            waitOnline: {
              title: 'waitOnline',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'WaitOnline',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'MachineReboot',
        namespaceURI: ''
      },
      propertiesOrder: [
        'remoteMachineAfterReboot',
        'setupCommand',
        'setupArguments',
        'setupWaitForExit',
        'setupExitCode',
        'setupRetries',
        'setupRetrySleep',
        'runSetupCommand',
        'teardownCommand',
        'teardownArguments',
        'teardownWaitForExit',
        'teardownExitCode',
        'teardownRetries',
        'teardownRetrySleep',
        'runTeardownCommand',
        'rebootCommand',
        'rebootArguments',
        'rebootWaitForExit',
        'rebootExitCode',
        'rebootRetries',
        'rebootRetrySleep',
        'offlineRetries',
        'offlineRetrySleep',
        'onlineRetries',
        'onlineRetrySleep',
        'waitOffline',
        'waitOnline'
      ]
    },
    UnregAgentJob: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'UnregAgentJob',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            name: {
              title: 'name',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Name',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'UnregAgentJob',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'vault', 'name', 'portalMachine']
    },
    Pair: {
      type: 'object',
      title: 'Pair',
      required: ['localizeField', 'localizeValue'],
      properties: {
        field: {
          title: 'field',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'field',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        localizeField: {
          title: 'localizeField',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'localizeField',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        value: {
          title: 'value',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'value',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        localizeValue: {
          title: 'localizeValue',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'localizeValue',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Pair',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['field', 'localizeField', 'value', 'localizeValue']
    },
    ReplaceRestoreTargetInVPR: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ReplaceRestoreTargetInVPR',
          properties: {
            vprFile: {
              title: 'vprFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VPRFile',
                namespaceURI: ''
              }
            },
            targetVM: {
              title: 'targetVM',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetVM',
                namespaceURI: ''
              }
            },
            dataStoreName: {
              title: 'dataStoreName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DataStoreName',
                namespaceURI: ''
              }
            },
            diskNumbers: {
              title: 'diskNumbers',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DiskNumbers',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ReplaceRestoreTargetInVPR',
        namespaceURI: ''
      },
      propertiesOrder: ['vprFile', 'targetVM', 'dataStoreName', 'diskNumbers']
    },
    ObjectSpec: {
      type: 'object',
      title: 'ObjectSpec',
      required: ['localize'],
      properties: {
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'name',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        displayName: {
          title: 'displayName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'displayName',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        localize: {
          title: 'localize',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'localize',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        type: {
          title: 'type',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'type',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        alternates: {
          title: 'alternates',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Pair'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'alternates',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ObjectSpec',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['name', 'displayName', 'localize', 'type', 'alternates', 'customInfo']
    },
    ScheduleCycle: {
      type: 'object',
      title: 'ScheduleCycle',
      required: ['hour', 'minute', 'lastDayOfMonth'],
      properties: {
        type: {
          title: 'type',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'type',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        hour: {
          title: 'hour',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'hour',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        minute: {
          title: 'minute',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'minute',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        daysOfWeek: {
          title: 'daysOfWeek',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'daysOfWeek',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        daysOfMonth: {
          title: 'daysOfMonth',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'daysOfMonth',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        lastDayOfMonth: {
          title: 'lastDayOfMonth',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'lastDayOfMonth',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        custom: {
          title: 'custom',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'custom',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ScheduleCycle',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['type', 'hour', 'minute', 'daysOfWeek', 'daysOfMonth', 'lastDayOfMonth', 'custom', 'customInfo']
    },
    VerifyLogForErrors: {
      required: ['restorePassCount', 'ignoreNestedMessages'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyLogForErrors',
          properties: {
            restorePassCount: {
              title: 'restorePassCount',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RestorePassCount',
                namespaceURI: ''
              }
            },
            ignoreValidation: {
              title: 'ignoreValidation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IgnoreValidation',
                namespaceURI: ''
              }
            },
            ignoreConnectionErrors: {
              title: 'ignoreConnectionErrors',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IgnoreConnectionErrors',
                namespaceURI: ''
              }
            },
            ignoreNestedMessages: {
              title: 'ignoreNestedMessages',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IgnoreNestedMessages',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyLogForErrors',
        namespaceURI: ''
      },
      propertiesOrder: ['restorePassCount', 'ignoreValidation', 'ignoreConnectionErrors', 'ignoreNestedMessages']
    },
    ScrapeLog: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ScrapeLog',
          properties: {
            files: {
              title: 'files',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Files',
                namespaceURI: ''
              }
            },
            matches: {
              title: 'matches',
              allOf: [
                {
                  $ref: '#/definitions/ExpectedLogMatches'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Matches',
                namespaceURI: ''
              }
            },
            sourcePath: {
              title: 'sourcePath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'SourcePath',
                namespaceURI: ''
              }
            },
            source: {
              title: 'source',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Source',
                namespaceURI: ''
              }
            },
            job: {
              title: 'job',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Job',
                namespaceURI: ''
              }
            },
            expectedMatches: {
              title: 'expectedMatches',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedMatches',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ScrapeLog',
        namespaceURI: ''
      },
      propertiesOrder: ['files', 'matches', 'sourcePath', 'source', 'job', 'expectedMatches']
    },
    ReplaceDatastoreUuidInVPR: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ReplaceDatastoreUuidInVPR',
          properties: {
            vprFile: {
              title: 'vprFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VPRFile',
                namespaceURI: ''
              }
            },
            targetVM: {
              title: 'targetVM',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetVM',
                namespaceURI: ''
              }
            },
            dataStoreName: {
              title: 'dataStoreName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DataStoreName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ReplaceDatastoreUuidInVPR',
        namespaceURI: ''
      },
      propertiesOrder: ['vprFile', 'targetVM', 'dataStoreName']
    },
    UnixPathManipulator: {
      allOf: [
        {
          $ref: '#/definitions/PathManipulator'
        },
        {
          type: 'object',
          title: 'UnixPathManipulator',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'UnixPathManipulator',
        namespaceURI: ''
      }
    },
    RevertToSnapshot: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'RevertToSnapshot',
          properties: {
            vmName: {
              title: 'vmName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VMName',
                namespaceURI: ''
              }
            },
            vSphereServer: {
              title: 'vSphereServer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'vSphereServer',
                namespaceURI: ''
              }
            },
            snapshotName: {
              title: 'snapshotName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SnapshotName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RevertToSnapshot',
        namespaceURI: ''
      },
      propertiesOrder: ['vmName', 'vSphereServer', 'snapshotName']
    },
    VariableOfUInt32: {
      allOf: [
        {
          $ref: '#/definitions/Variable'
        },
        {
          type: 'object',
          title: 'VariableOfUInt32',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VariableOfUInt32',
        namespaceURI: ''
      }
    },
    CommandList: {
      type: 'object',
      title: 'CommandList',
      properties: {
        agentControlOrAssignOrBackup: {
          title: 'agentControlOrAssignOrBackup',
          allOf: [
            {
              type: 'array',
              items: {
                anyOf: [
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/AgentControl'
                      }
                    ],
                    elementName: {
                      localPart: 'AgentControl',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Assign'
                      }
                    ],
                    elementName: {
                      localPart: 'Assign',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Backup'
                      }
                    ],
                    elementName: {
                      localPart: 'Backup',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/BMRestore'
                      }
                    ],
                    elementName: {
                      localPart: 'BMRestore',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ChangeDate'
                      }
                    ],
                    elementName: {
                      localPart: 'ChangeDate',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ChangeFile'
                      }
                    ],
                    elementName: {
                      localPart: 'ChangeFile',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ChangeTime'
                      }
                    ],
                    elementName: {
                      localPart: 'ChangeTime',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckCompressedBytesRatio'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckCompressedBytesRatio',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckDumps'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckDumps',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckEventLogs'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckEventLogs',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckElapsedTime'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckElapsedTime',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckMailboxSize'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckMailboxSize',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckVMCBTEnabled'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckVMCBTEnabled',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckVMDiskProvisionType'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckVMDiskProvisionType',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckVMProperty'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckVMProperty',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ClearEventLogs'
                      }
                    ],
                    elementName: {
                      localPart: 'ClearEventLogs',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckFileForString'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckFileForString',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckIsProcessRunning'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckIsProcessRunning',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckWindowsServices'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckWindowsServices',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CompareFile'
                      }
                    ],
                    elementName: {
                      localPart: 'CompareFile',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CompareFileVersion'
                      }
                    ],
                    elementName: {
                      localPart: 'CompareFileVersion',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/GetFileVersion'
                      }
                    ],
                    elementName: {
                      localPart: 'GetFileVersion',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CompareHashLogs'
                      }
                    ],
                    elementName: {
                      localPart: 'CompareHashLogs',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ComparePSAttributeToString'
                      }
                    ],
                    elementName: {
                      localPart: 'ComparePSAttributeToString',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckVar'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckVar',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ControlExchangeDatabase'
                      }
                    ],
                    elementName: {
                      localPart: 'ControlExchangeDatabase',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CopyFiles'
                      }
                    ],
                    elementName: {
                      localPart: 'CopyFiles',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CloneFiles'
                      }
                    ],
                    elementName: {
                      localPart: 'CloneFiles',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CopyLogs'
                      }
                    ],
                    elementName: {
                      localPart: 'CopyLogs',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CopyVaultLogs'
                      }
                    ],
                    elementName: {
                      localPart: 'CopyVaultLogs',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ManageAgentRetentions'
                      }
                    ],
                    elementName: {
                      localPart: 'ManageAgentRetentions',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CountSafesetsOnAgent'
                      }
                    ],
                    elementName: {
                      localPart: 'CountSafesetsOnAgent',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CountSafesetsOnVault'
                      }
                    ],
                    elementName: {
                      localPart: 'CountSafesetsOnVault',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CountXLOGs'
                      }
                    ],
                    elementName: {
                      localPart: 'CountXLOGs',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CreateBatchOnWinMachine'
                      }
                    ],
                    elementName: {
                      localPart: 'CreateBatchOnWinMachine',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CreateDir'
                      }
                    ],
                    elementName: {
                      localPart: 'CreateDir',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CreateExchangeDB'
                      }
                    ],
                    elementName: {
                      localPart: 'CreateExchangeDB',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CreateExchangeMailbox'
                      }
                    ],
                    elementName: {
                      localPart: 'CreateExchangeMailbox',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CreateExchangeRecoveryDB'
                      }
                    ],
                    elementName: {
                      localPart: 'CreateExchangeRecoveryDB',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CreateScriptFile'
                      }
                    ],
                    elementName: {
                      localPart: 'CreateScriptFile',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DebugNext'
                      }
                    ],
                    elementName: {
                      localPart: 'DebugNext',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DeleteDeltaFiles'
                      }
                    ],
                    elementName: {
                      localPart: 'DeleteDeltaFiles',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DeleteEmails'
                      }
                    ],
                    elementName: {
                      localPart: 'DeleteEmails',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DeleteFiles'
                      }
                    ],
                    elementName: {
                      localPart: 'DeleteFiles',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DeleteSafeset'
                      }
                    ],
                    elementName: {
                      localPart: 'DeleteSafeset',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DeleteVaultRegistration'
                      }
                    ],
                    elementName: {
                      localPart: 'DeleteVaultRegistration',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DeleteVSSSnapshots'
                      }
                    ],
                    elementName: {
                      localPart: 'DeleteVSSSnapshots',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Echo'
                      }
                    ],
                    elementName: {
                      localPart: 'Echo',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DeployVRA'
                      }
                    ],
                    elementName: {
                      localPart: 'DeployVRA',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/DownloadJobFromAnotherComputer'
                      }
                    ],
                    elementName: {
                      localPart: 'DownloadJobFromAnotherComputer',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/EWSDelete'
                      }
                    ],
                    elementName: {
                      localPart: 'EWSDelete',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Exchange2010Cmdlet'
                      }
                    ],
                    elementName: {
                      localPart: 'Exchange2010Cmdlet',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ExecuteSSHCommandSet'
                      }
                    ],
                    elementName: {
                      localPart: 'ExecuteSSHCommandSet',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Fail'
                      }
                    ],
                    elementName: {
                      localPart: 'Fail',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/FileExists'
                      }
                    ],
                    elementName: {
                      localPart: 'FileExists',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/FindReplaceVMUuid'
                      }
                    ],
                    elementName: {
                      localPart: 'FindReplaceVMUuid',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/GenerateFile'
                      }
                    ],
                    elementName: {
                      localPart: 'GenerateFile',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/GenFiles'
                      }
                    ],
                    elementName: {
                      localPart: 'GenFiles',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Hasher'
                      }
                    ],
                    elementName: {
                      localPart: 'Hasher',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/HashLogger'
                      }
                    ],
                    elementName: {
                      localPart: 'HashLogger',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/InstallAgent'
                      }
                    ],
                    elementName: {
                      localPart: 'InstallAgent',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/InstallHyperVHost'
                      }
                    ],
                    elementName: {
                      localPart: 'InstallHyperVHost',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/InstallHyperVManagement'
                      }
                    ],
                    elementName: {
                      localPart: 'InstallHyperVManagement',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Loop'
                      }
                    ],
                    elementName: {
                      localPart: 'Loop',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/MachineConnectivity'
                      }
                    ],
                    elementName: {
                      localPart: 'MachineConnectivity',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/MachineOp'
                      }
                    ],
                    elementName: {
                      localPart: 'MachineOp',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/MachineReboot'
                      }
                    ],
                    elementName: {
                      localPart: 'MachineReboot',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Macro'
                      }
                    ],
                    elementName: {
                      localPart: 'Macro',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/MakeScriptRunnable'
                      }
                    ],
                    elementName: {
                      localPart: 'MakeScriptRunnable',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ModifyJobOnAgent'
                      }
                    ],
                    elementName: {
                      localPart: 'ModifyJobOnAgent',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Mount'
                      }
                    ],
                    elementName: {
                      localPart: 'Mount',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/MoveExchangeDatabases'
                      }
                    ],
                    elementName: {
                      localPart: 'MoveExchangeDatabases',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ParseFileUsingRegularExpression'
                      }
                    ],
                    elementName: {
                      localPart: 'ParseFileUsingRegularExpression',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/PowerShell'
                      }
                    ],
                    elementName: {
                      localPart: 'PowerShell',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/PrepareForExchangeVSSRestore'
                      }
                    ],
                    elementName: {
                      localPart: 'PrepareForExchangeVSSRestore',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/PSLocalScript'
                      }
                    ],
                    elementName: {
                      localPart: 'PSLocalScript',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/PSRemoteScript'
                      }
                    ],
                    elementName: {
                      localPart: 'PSRemoteScript',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/PSScriptEx2010Cmdlets'
                      }
                    ],
                    elementName: {
                      localPart: 'PSScriptEx2010Cmdlets',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Queue'
                      }
                    ],
                    elementName: {
                      localPart: 'Queue',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ReadFiles'
                      }
                    ],
                    elementName: {
                      localPart: 'ReadFiles',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RecordCommandsExecutionTime'
                      }
                    ],
                    elementName: {
                      localPart: 'RecordCommandsExecutionTime',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RecordCustomFieldValue'
                      }
                    ],
                    elementName: {
                      localPart: 'RecordCustomFieldValue',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RecordLogExecutionTime'
                      }
                    ],
                    elementName: {
                      localPart: 'RecordLogExecutionTime',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RecordResultToTestlink'
                      }
                    ],
                    elementName: {
                      localPart: 'RecordResultToTestlink',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RegisterAgent'
                      }
                    ],
                    elementName: {
                      localPart: 'RegisterAgent',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RegisterEnvironment'
                      }
                    ],
                    elementName: {
                      localPart: 'RegisterEnvironment',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RegisterJob'
                      }
                    ],
                    elementName: {
                      localPart: 'RegisterJob',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RemoteSystemCommand'
                      }
                    ],
                    elementName: {
                      localPart: 'RemoteSystemCommand',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RemoveTemplate'
                      }
                    ],
                    elementName: {
                      localPart: 'RemoveTemplate',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ReplaceVMuuidInVPR'
                      }
                    ],
                    elementName: {
                      localPart: 'ReplaceVMuuidInVPR',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ReplaceVMuuidInVVC'
                      }
                    ],
                    elementName: {
                      localPart: 'ReplaceVMuuidInVVC',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Restore'
                      }
                    ],
                    elementName: {
                      localPart: 'Restore',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RevertToSnapshot'
                      }
                    ],
                    elementName: {
                      localPart: 'RevertToSnapshot',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RunSQLQuery'
                      }
                    ],
                    elementName: {
                      localPart: 'RunSQLQuery',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RunQueue'
                      }
                    ],
                    elementName: {
                      localPart: 'RunQueue',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/RunVaultOperation'
                      }
                    ],
                    elementName: {
                      localPart: 'RunVaultOperation',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ScrapeLog'
                      }
                    ],
                    elementName: {
                      localPart: 'ScrapeLog',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SetGlobalVVCProperty'
                      }
                    ],
                    elementName: {
                      localPart: 'SetGlobalVVCProperty',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SetJobVVCProperty'
                      }
                    ],
                    elementName: {
                      localPart: 'SetJobVVCProperty',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SetVaultStatus'
                      }
                    ],
                    elementName: {
                      localPart: 'SetVaultStatus',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SetVCenterCredentials'
                      }
                    ],
                    elementName: {
                      localPart: 'SetVCenterCredentials',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SendEmail'
                      }
                    ],
                    elementName: {
                      localPart: 'SendEmail',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Sleep'
                      }
                    ],
                    elementName: {
                      localPart: 'Sleep',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Pause'
                      }
                    ],
                    elementName: {
                      localPart: 'Pause',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SQLDataCompare'
                      }
                    ],
                    elementName: {
                      localPart: 'SQLDataCompare',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SQLSchemaCompare'
                      }
                    ],
                    elementName: {
                      localPart: 'SQLSchemaCompare',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SSHRemoteSystemCommand'
                      }
                    ],
                    elementName: {
                      localPart: 'SSHRemoteSystemCommand',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/StartRecordingNetworkUsage'
                      }
                    ],
                    elementName: {
                      localPart: 'StartRecordingNetworkUsage',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/StopRecordingAndCheckNetworkUsage'
                      }
                    ],
                    elementName: {
                      localPart: 'StopRecordingAndCheckNetworkUsage',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/StopActiveProcesses'
                      }
                    ],
                    elementName: {
                      localPart: 'StopActiveProcesses',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Succeed'
                      }
                    ],
                    elementName: {
                      localPart: 'Succeed',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/Sync'
                      }
                    ],
                    elementName: {
                      localPart: 'Sync',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SyncSatelliteVault'
                      }
                    ],
                    elementName: {
                      localPart: 'SyncSatelliteVault',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/SystemCommand'
                      }
                    ],
                    elementName: {
                      localPart: 'SystemCommand',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/TeamConnectivity'
                      }
                    ],
                    elementName: {
                      localPart: 'TeamConnectivity',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/TeamMachineOp'
                      }
                    ],
                    elementName: {
                      localPart: 'TeamMachineOp',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ThrottleAgent'
                      }
                    ],
                    elementName: {
                      localPart: 'ThrottleAgent',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/UnixDosConversion'
                      }
                    ],
                    elementName: {
                      localPart: 'UnixDosConversion',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/UnregAgentJob'
                      }
                    ],
                    elementName: {
                      localPart: 'UnregAgentJob',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/UnregisterAgent'
                      }
                    ],
                    elementName: {
                      localPart: 'UnregisterAgent',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/UnregisterJob'
                      }
                    ],
                    elementName: {
                      localPart: 'UnregisterJob',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyExchangeVSSHardRecovery'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyExchangeVSSHardRecovery',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyLog'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyLog',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyAllLogs'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyAllLogs',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyLogForErrors'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyLogForErrors',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyAllLogsForErrors'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyAllLogsForErrors',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyLogForString'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyLogForString',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyLogForMessages'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyLogForMessages',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyLogHasSmallExchangeDelta'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyLogHasSmallExchangeDelta',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyLogHasZeroDeltizedBytes'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyLogHasZeroDeltizedBytes',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyVaultLogsForErrors'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyVaultLogsForErrors',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyState'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyState',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifySyncLogForErrors'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifySyncLogForErrors',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/WaitForVMSnapshots'
                      }
                    ],
                    elementName: {
                      localPart: 'WaitForVMSnapshots',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckDeferralResume'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckDeferralResume',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyBackupDidNotReseed'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyBackupDidNotReseed',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyRestoreToOriginalLocation'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyRestoreToOriginalLocation',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/AddPasswordToJob'
                      }
                    ],
                    elementName: {
                      localPart: 'AddPasswordToJob',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckTraceFile'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckTraceFile',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/IsAgentRegisteredToVault'
                      }
                    ],
                    elementName: {
                      localPart: 'IsAgentRegisteredToVault',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ReplaceRestoreTargetInVPR'
                      }
                    ],
                    elementName: {
                      localPart: 'ReplaceRestoreTargetInVPR',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ReplaceDatastoreUuidInVPR'
                      }
                    ],
                    elementName: {
                      localPart: 'ReplaceDatastoreUuidInVPR',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ReplaceRegistrationHostUuidInVPR'
                      }
                    ],
                    elementName: {
                      localPart: 'ReplaceRegistrationHostUuidInVPR',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/FindInFile'
                      }
                    ],
                    elementName: {
                      localPart: 'FindInFile',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CheckVaultProfile'
                      }
                    ],
                    elementName: {
                      localPart: 'CheckVaultProfile',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/ReplaceVMuuidInJson'
                      }
                    ],
                    elementName: {
                      localPart: 'ReplaceVMuuidInJson',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/WaitForProcessCompletion'
                      }
                    ],
                    elementName: {
                      localPart: 'WaitForProcessCompletion',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/GetDate'
                      }
                    ],
                    elementName: {
                      localPart: 'GetDate',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/UpdateXmlValues'
                      }
                    ],
                    elementName: {
                      localPart: 'UpdateXmlValues',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/VerifyExchangeDBReseed'
                      }
                    ],
                    elementName: {
                      localPart: 'VerifyExchangeDBReseed',
                      namespaceURI: ''
                    }
                  },
                  {
                    anyOf: [
                      {
                        $ref: '#/definitions/CalculateFileHash'
                      }
                    ],
                    elementName: {
                      localPart: 'CalculateFileHash',
                      namespaceURI: ''
                    }
                  }
                ]
              },
              minItems: 0
            }
          ],
          propertyType: 'elements'
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'CommandList',
        namespaceURI: ''
      },
      propertiesOrder: ['agentControlOrAssignOrBackup']
    },
    CheckVaultProfile: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckVaultProfile',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckVaultProfile',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'vault']
    },
    CheckIsProcessRunning: {
      required: ['expectedRunning'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckIsProcessRunning',
          properties: {
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            processId: {
              title: 'processId',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ProcessId',
                namespaceURI: ''
              }
            },
            expectedRunning: {
              title: 'expectedRunning',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedRunning',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckIsProcessRunning',
        namespaceURI: ''
      },
      propertiesOrder: ['target', 'processId', 'expectedRunning']
    },
    MachineConnectivity: {
      allOf: [
        {
          $ref: '#/definitions/RemoteSystemCommand'
        },
        {
          type: 'object',
          title: 'MachineConnectivity',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'MachineConnectivity',
        namespaceURI: ''
      }
    },
    RunQueue: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RunQueue',
          properties: {
            name: {
              title: 'name',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Name',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RunQueue',
        namespaceURI: ''
      },
      propertiesOrder: ['name']
    },
    MasterConfig: {
      type: 'object',
      title: 'MasterConfig',
      required: ['logLevel', 'displayLevel'],
      properties: {
        testPath: {
          title: 'testPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'TestPath',
            namespaceURI: ''
          }
        },
        utilityPath: {
          title: 'utilityPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'UtilityPath',
            namespaceURI: ''
          }
        },
        logPath: {
          title: 'logPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'LogPath',
            namespaceURI: ''
          }
        },
        logLevel: {
          title: 'logLevel',
          allOf: [
            {
              $ref: '#/definitions/Severity'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'LogLevel',
            namespaceURI: ''
          }
        },
        displayLevel: {
          title: 'displayLevel',
          allOf: [
            {
              $ref: '#/definitions/Severity'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'DisplayLevel',
            namespaceURI: ''
          }
        },
        machineDetails: {
          title: 'machineDetails',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfMachine'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'MachineDetails',
            namespaceURI: ''
          }
        },
        machinePath: {
          title: 'machinePath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'MachinePath',
            namespaceURI: ''
          }
        },
        teamDetails: {
          title: 'teamDetails',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfTeam'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'TeamDetails',
            namespaceURI: ''
          }
        },
        teamPath: {
          title: 'teamPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'TeamPath',
            namespaceURI: ''
          }
        },
        suiteDetails: {
          title: 'suiteDetails',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfSuite'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'SuiteDetails',
            namespaceURI: ''
          }
        },
        suitePath: {
          title: 'suitePath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'SuitePath',
            namespaceURI: ''
          }
        },
        providerPath: {
          title: 'providerPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'ProviderPath',
            namespaceURI: ''
          }
        },
        testPlan: {
          title: 'testPlan',
          allOf: [
            {
              $ref: '#/definitions/Plan'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'TestPlan',
            namespaceURI: ''
          }
        },
        testPlanPath: {
          title: 'testPlanPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'TestPlanPath',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'MasterConfig',
        namespaceURI: ''
      },
      propertiesOrder: [
        'testPath',
        'utilityPath',
        'logPath',
        'logLevel',
        'displayLevel',
        'machineDetails',
        'machinePath',
        'teamDetails',
        'teamPath',
        'suiteDetails',
        'suitePath',
        'providerPath',
        'testPlan',
        'testPlanPath'
      ]
    },
    PSObject: {
      type: 'object',
      title: 'PSObject',
      properties: {
        members: {
          title: 'members',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfPSMemberInfo'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Members',
            namespaceURI: ''
          }
        },
        properties: {
          title: 'properties',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfPSPropertyInfo'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Properties',
            namespaceURI: ''
          }
        },
        methods: {
          title: 'methods',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfPSMethodInfo'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Methods',
            namespaceURI: ''
          }
        },
        typeNames: {
          title: 'typeNames',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfString'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'TypeNames',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'PSObject',
        namespaceURI: ''
      },
      propertiesOrder: ['members', 'properties', 'methods', 'typeNames']
    },
    SuiteTest: {
      type: 'object',
      title: 'SuiteTest',
      required: ['isCritical'],
      properties: {
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Name',
            namespaceURI: ''
          }
        },
        isCritical: {
          title: 'isCritical',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'IsCritical',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'SuiteTest',
        namespaceURI: ''
      },
      propertiesOrder: ['name', 'isCritical']
    },
    ExchangeDatabase: {
      type: 'object',
      title: 'ExchangeDatabase',
      required: ['publicFolder'],
      properties: {
        storageGroupName: {
          title: 'storageGroupName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'StorageGroupName',
            namespaceURI: ''
          }
        },
        databaseName: {
          title: 'databaseName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'DatabaseName',
            namespaceURI: ''
          }
        },
        publicFolder: {
          title: 'publicFolder',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'PublicFolder',
            namespaceURI: ''
          }
        },
        guid: {
          title: 'guid',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Guid',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ExchangeDatabase',
        namespaceURI: ''
      },
      propertiesOrder: ['storageGroupName', 'databaseName', 'publicFolder', 'guid']
    },
    ArrayOfPSPropertyInfo: {
      type: 'object',
      title: 'ArrayOfPSPropertyInfo',
      properties: {
        psPropertyInfo: {
          title: 'psPropertyInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/PSPropertyInfo'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'PSPropertyInfo',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfPSPropertyInfo',
        namespaceURI: ''
      },
      propertiesOrder: ['psPropertyInfo']
    },
    IntegerVariable: {
      allOf: [
        {
          $ref: '#/definitions/VariableOfInt32'
        },
        {
          type: 'object',
          title: 'IntegerVariable',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'IntegerVariable',
        namespaceURI: ''
      }
    },
    VariableOfInt32: {
      allOf: [
        {
          $ref: '#/definitions/Variable'
        },
        {
          type: 'object',
          title: 'VariableOfInt32',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VariableOfInt32',
        namespaceURI: ''
      }
    },
    BooleanVariable: {
      allOf: [
        {
          $ref: '#/definitions/VariableOfBoolean'
        },
        {
          type: 'object',
          title: 'BooleanVariable',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'BooleanVariable',
        namespaceURI: ''
      }
    },
    ChangeFile: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ChangeFile',
          properties: {
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: '#/definitions/MachinePath'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            pattern: {
              title: 'pattern',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Pattern',
                namespaceURI: ''
              }
            },
            deltaSize: {
              title: 'deltaSize',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DeltaSize',
                namespaceURI: ''
              }
            },
            firstBlock: {
              title: 'firstBlock',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FirstBlock',
                namespaceURI: ''
              }
            },
            numBlocks: {
              title: 'numBlocks',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NumBlocks',
                namespaceURI: ''
              }
            },
            newSize: {
              title: 'newSize',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NewSize',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ChangeFile',
        namespaceURI: ''
      },
      propertiesOrder: ['target', 'pattern', 'deltaSize', 'firstBlock', 'numBlocks', 'newSize']
    },
    Macro: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Macro',
          properties: {
            filePathAndName: {
              title: 'filePathAndName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePathAndName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Macro',
        namespaceURI: ''
      },
      propertiesOrder: ['filePathAndName']
    },
    PowerShell: {
      required: ['isBoolean', 'displayResults'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'PowerShell',
          properties: {
            script: {
              title: 'script',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Script',
                namespaceURI: ''
              }
            },
            expectedResultSize: {
              title: 'expectedResultSize',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedResultSize',
                namespaceURI: ''
              }
            },
            isBoolean: {
              title: 'isBoolean',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IsBoolean',
                namespaceURI: ''
              }
            },
            displayResults: {
              title: 'displayResults',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DisplayResults',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'PowerShell',
        namespaceURI: ''
      },
      propertiesOrder: ['script', 'expectedResultSize', 'isBoolean', 'displayResults']
    },
    JobEncryption: {
      type: 'object',
      title: 'JobEncryption',
      required: ['passwordChanged'],
      properties: {
        method: {
          title: 'method',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'method',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        password: {
          title: 'password',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'password',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        passwordChanged: {
          title: 'passwordChanged',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'passwordChanged',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'JobEncryption',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['method', 'password', 'passwordChanged', 'customInfo']
    },
    Parameter: {
      type: 'object',
      title: 'Parameter',
      properties: {
        value: {
          title: 'value',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Value',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Parameter',
        namespaceURI: ''
      },
      propertiesOrder: ['value']
    },
    Sleep: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Sleep',
          properties: {
            conditions: {
              title: 'conditions',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfSleepCondition'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Conditions',
                namespaceURI: ''
              }
            },
            seconds: {
              title: 'seconds',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Seconds',
                namespaceURI: ''
              }
            },
            minutes: {
              title: 'minutes',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Minutes',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Sleep',
        namespaceURI: ''
      },
      propertiesOrder: ['conditions', 'seconds', 'minutes']
    },
    OutVar: {
      type: 'object',
      title: 'OutVar',
      properties: {
        readFrom: {
          title: 'readFrom',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ReadFrom',
            namespaceURI: ''
          }
        },
        assignTo: {
          title: 'assignTo',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'AssignTo',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'OutVar',
        namespaceURI: ''
      },
      propertiesOrder: ['readFrom', 'assignTo']
    },
    ArrayOfExchangeDatabase: {
      type: 'object',
      title: 'ArrayOfExchangeDatabase',
      properties: {
        exchangeDatabase: {
          title: 'exchangeDatabase',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/ExchangeDatabase'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'ExchangeDatabase',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfExchangeDatabase',
        namespaceURI: ''
      },
      propertiesOrder: ['exchangeDatabase']
    },
    ReplaceVMuuidInVPR: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ReplaceVMuuidInVPR',
          properties: {
            vMsToBeRestored: {
              title: 'vMsToBeRestored',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'VMsToBeRestored',
                namespaceURI: ''
              }
            },
            vprFile: {
              title: 'vprFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VPRFile',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ReplaceVMuuidInVPR',
        namespaceURI: ''
      },
      propertiesOrder: ['vMsToBeRestored', 'vprFile']
    },
    VariableOfBoolean: {
      allOf: [
        {
          $ref: '#/definitions/Variable'
        },
        {
          type: 'object',
          title: 'VariableOfBoolean',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VariableOfBoolean',
        namespaceURI: ''
      }
    },
    JobTapeSettings: {
      type: 'object',
      title: 'JobTapeSettings',
      required: ['operatorAssisted', 'ignoreLabel', 'initializeTape', 'unloadAfterCompletion', 'useEOD', 'useNewTape'],
      properties: {
        operatorAssisted: {
          title: 'operatorAssisted',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'operatorAssisted',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        ignoreLabel: {
          title: 'ignoreLabel',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'ignoreLabel',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        initializeTape: {
          title: 'initializeTape',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'initializeTape',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        unloadAfterCompletion: {
          title: 'unloadAfterCompletion',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'unloadAfterCompletion',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        useEOD: {
          title: 'useEOD',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'useEOD',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        useNewTape: {
          title: 'useNewTape',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'useNewTape',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        tapeLabel: {
          title: 'tapeLabel',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'tapeLabel',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'JobTapeSettings',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: [
        'operatorAssisted',
        'ignoreLabel',
        'initializeTape',
        'unloadAfterCompletion',
        'useEOD',
        'useNewTape',
        'tapeLabel',
        'customInfo'
      ]
    },
    ModifyJobOnAgent: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ModifyJobOnAgent',
          properties: {
            configFile: {
              title: 'configFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'ConfigFile',
                namespaceURI: ''
              }
            },
            job: {
              title: 'job',
              allOf: [
                {
                  $ref: '#/definitions/JobConfig'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Job',
                namespaceURI: ''
              }
            },
            sources: {
              title: 'sources',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfSourceOverride'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Sources',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            name: {
              title: 'name',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Name',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ModifyJobOnAgent',
        namespaceURI: ''
      },
      propertiesOrder: ['configFile', 'job', 'sources', 'agent', 'vault', 'name']
    },
    ObjectSelector: {
      type: 'object',
      title: 'ObjectSelector',
      required: ['recursive'],
      properties: {
        startLocation: {
          title: 'startLocation',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'startLocation',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        displayLocation: {
          title: 'displayLocation',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/ObjectSpec'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'displayLocation',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        separator: {
          title: 'separator',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'separator',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        containerSpecs: {
          title: 'containerSpecs',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/ObjectSpec'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'containerSpecs',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        specs: {
          title: 'specs',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/ObjectSpec'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'specs',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        returnType: {
          title: 'returnType',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'returnType',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        recursive: {
          title: 'recursive',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'recursive',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        dateFilters: {
          title: 'dateFilters',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/DateFilter'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'dateFilters',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ObjectSelector',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: [
        'startLocation',
        'displayLocation',
        'separator',
        'containerSpecs',
        'specs',
        'returnType',
        'recursive',
        'dateFilters',
        'customInfo'
      ]
    },
    DeleteDeltaFiles: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DeleteDeltaFiles',
          properties: {
            safesets: {
              title: 'safesets',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfInt'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Safesets',
                namespaceURI: ''
              }
            },
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            retryLimit: {
              title: 'retryLimit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RetryLimit',
                namespaceURI: ''
              }
            },
            retryTimeout: {
              title: 'retryTimeout',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RetryTimeout',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DeleteDeltaFiles',
        namespaceURI: ''
      },
      propertiesOrder: ['safesets', 'target', 'jobName', 'retryLimit', 'retryTimeout']
    },
    DeleteVaultRegistration: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DeleteVaultRegistration',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DeleteVaultRegistration',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'vault', 'portalMachine']
    },
    StopActiveProcesses: {
      required: ['terminate'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'StopActiveProcesses',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            terminate: {
              title: 'terminate',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Terminate',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'StopActiveProcesses',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'jobName', 'terminate']
    },
    Restore: {
      required: ['wait', 'forceEncryption'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Restore',
          properties: {
            optionsFile: {
              title: 'optionsFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'OptionsFile',
                namespaceURI: ''
              }
            },
            options: {
              title: 'options',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfRestoreOptions'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Options',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            },
            wait: {
              title: 'wait',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Wait',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            },
            retentionID: {
              title: 'retentionID',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RetentionID',
                namespaceURI: ''
              }
            },
            forceEncryption: {
              title: 'forceEncryption',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ForceEncryption',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Restore',
        namespaceURI: ''
      },
      propertiesOrder: [
        'optionsFile',
        'options',
        'agent',
        'jobName',
        'portalMachine',
        'wait',
        'password',
        'retentionID',
        'forceEncryption'
      ]
    },
    ArrayOfMachine: {
      type: 'object',
      title: 'ArrayOfMachine',
      properties: {
        machine: {
          title: 'machine',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Machine'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Machine',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfMachine',
        namespaceURI: ''
      },
      propertiesOrder: ['machine']
    },
    ArrayOfTeam: {
      type: 'object',
      title: 'ArrayOfTeam',
      properties: {
        team: {
          title: 'team',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Team'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Team',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfTeam',
        namespaceURI: ''
      },
      propertiesOrder: ['team']
    },
    FindReplaceVMUuid: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'FindReplaceVMUuid',
          properties: {
            optionsFile: {
              title: 'optionsFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'OptionsFile',
                namespaceURI: ''
              }
            },
            configFile: {
              title: 'configFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'ConfigFile',
                namespaceURI: ''
              }
            },
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'FindReplaceVMUuid',
        namespaceURI: ''
      },
      propertiesOrder: ['optionsFile', 'configFile', 'remoteMachine']
    },
    CheckEventLogs: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckEventLogs',
          properties: {
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckEventLogs',
        namespaceURI: ''
      },
      propertiesOrder: ['targetMachine']
    },
    CustomObject: {
      type: 'object',
      title: 'CustomObject',
      required: ['binaryObject'],
      properties: {
        xmlObject: {
          title: 'xmlObject',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'xmlObject',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        binaryObject: {
          title: 'binaryObject',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/base64Binary'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'binaryObject',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        objectId: {
          title: 'objectId',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'objectId',
            namespaceURI: ''
          }
        },
        binaryFormat: {
          title: 'binaryFormat',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'binaryFormat',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'CustomObject',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['xmlObject', 'binaryObject', 'objectId', 'binaryFormat']
    },
    'Machine.Locations': {
      type: 'object',
      title: 'Machine.Locations',
      required: ['any'],
      properties: {
        any: {
          title: 'any',
          allOf: [
            {
              type: 'object',
              properties: {
                name: {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
                },
                value: {}
              }
            }
          ],
          propertyType: 'anyElement'
        }
      },
      typeType: 'classInfo',
      propertiesOrder: ['any']
    },
    DeployVRA: {
      required: ['handleOldVRA', 'thickStorage'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DeployVRA',
          properties: {
            vraMachine: {
              title: 'vraMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VRAMachine',
                namespaceURI: ''
              }
            },
            datastoreName: {
              title: 'datastoreName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DatastoreName',
                namespaceURI: ''
              }
            },
            hostMachine: {
              title: 'hostMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'HostMachine',
                namespaceURI: ''
              }
            },
            hostAddress: {
              title: 'hostAddress',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'HostAddress',
                namespaceURI: ''
              }
            },
            ovaLocation: {
              title: 'ovaLocation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OvaLocation',
                namespaceURI: ''
              }
            },
            buildNumber: {
              title: 'buildNumber',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'BuildNumber',
                namespaceURI: ''
              }
            },
            rpmBuildNumber: {
              title: 'rpmBuildNumber',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RpmBuildNumber',
                namespaceURI: ''
              }
            },
            rpmLocation: {
              title: 'rpmLocation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RpmLocation',
                namespaceURI: ''
              }
            },
            forceUpgrade: {
              title: 'forceUpgrade',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ForceUpgrade',
                namespaceURI: ''
              }
            },
            serverMachine: {
              title: 'serverMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ServerMachine',
                namespaceURI: ''
              }
            },
            serverAddress: {
              title: 'serverAddress',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ServerAddress',
                namespaceURI: ''
              }
            },
            serverUserName: {
              title: 'serverUserName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ServerUserName',
                namespaceURI: ''
              }
            },
            serverPassword: {
              title: 'serverPassword',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ServerPassword',
                namespaceURI: ''
              }
            },
            resourcePool: {
              title: 'resourcePool',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ResourcePool',
                namespaceURI: ''
              }
            },
            shareUser: {
              title: 'shareUser',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ShareUser',
                namespaceURI: ''
              }
            },
            sharePassword: {
              title: 'sharePassword',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SharePassword',
                namespaceURI: ''
              }
            },
            handleOldVRA: {
              title: 'handleOldVRA',
              allOf: [
                {
                  $ref: '#/definitions/VRADeploymentOldMachineHandling'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'HandleOldVRA',
                namespaceURI: ''
              }
            },
            vmNetwork: {
              title: 'vmNetwork',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VMNetwork',
                namespaceURI: ''
              }
            },
            timezone: {
              title: 'timezone',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Timezone',
                namespaceURI: ''
              }
            },
            defaultUserName: {
              title: 'defaultUserName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'defaultUserName',
                namespaceURI: ''
              }
            },
            defaultPassword: {
              title: 'defaultPassword',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'defaultPassword',
                namespaceURI: ''
              }
            },
            thickStorage: {
              title: 'thickStorage',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ThickStorage',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DeployVRA',
        namespaceURI: ''
      },
      propertiesOrder: [
        'vraMachine',
        'datastoreName',
        'hostMachine',
        'hostAddress',
        'ovaLocation',
        'buildNumber',
        'rpmBuildNumber',
        'rpmLocation',
        'forceUpgrade',
        'serverMachine',
        'serverAddress',
        'serverUserName',
        'serverPassword',
        'resourcePool',
        'shareUser',
        'sharePassword',
        'handleOldVRA',
        'vmNetwork',
        'timezone',
        'defaultUserName',
        'defaultPassword',
        'thickStorage'
      ]
    },
    BackupOptions: {
      type: 'object',
      title: 'BackupOptions',
      required: ['processing', 'disablePrescan'],
      properties: {
        sources: {
          title: 'sources',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/JobSource'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'sources',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        processing: {
          title: 'processing',
          allOf: [
            {
              $ref: '#/definitions/JobProcessing'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'processing',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        disablePrescan: {
          title: 'disablePrescan',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'disablePrescan',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'BackupOptions',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: ['sources', 'processing', 'disablePrescan', 'customInfo']
    },
    CreateExchangeDB: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CreateExchangeDB',
          properties: {
            optionsFile: {
              title: 'optionsFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'OptionsFile',
                namespaceURI: ''
              }
            },
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            dbName: {
              title: 'dbName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DBName',
                namespaceURI: ''
              }
            },
            edbLocation: {
              title: 'edbLocation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'EDBLocation',
                namespaceURI: ''
              }
            },
            logsLocation: {
              title: 'logsLocation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogsLocation',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CreateExchangeDB',
        namespaceURI: ''
      },
      propertiesOrder: ['optionsFile', 'remoteMachine', 'dbName', 'edbLocation', 'logsLocation']
    },
    CheckVMCBTEnabled: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckVMCBTEnabled',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            vSphereServer: {
              title: 'vSphereServer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'vSphereServer',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckVMCBTEnabled',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'vSphereServer']
    },
    RecordCustomFieldValue: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RecordCustomFieldValue',
          properties: {
            customFieldName: {
              title: 'customFieldName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CustomFieldName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RecordCustomFieldValue',
        namespaceURI: ''
      },
      propertiesOrder: ['customFieldName']
    },
    RestoreOptions: {
      type: 'object',
      title: 'RestoreOptions',
      required: ['safesetId', 'disablePrescan', 'logSettings'],
      properties: {
        safesetId: {
          title: 'safesetId',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/unsignedInt'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'safesetId',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        source: {
          title: 'source',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'source',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        destination: {
          title: 'destination',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'destination',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        dataSources: {
          title: 'dataSources',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/JobSource'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'dataSources',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        disablePrescan: {
          title: 'disablePrescan',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'disablePrescan',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        logSettings: {
          title: 'logSettings',
          allOf: [
            {
              $ref: '#/definitions/JobLogSettings'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'logSettings',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        password: {
          title: 'password',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'password',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        existingFileAction: {
          title: 'existingFileAction',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'existingFileAction',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'RestoreOptions',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: [
        'safesetId',
        'source',
        'destination',
        'dataSources',
        'disablePrescan',
        'logSettings',
        'password',
        'existingFileAction',
        'customInfo'
      ]
    },
    RegisterJob: {
      required: ['useRandomEncryptionType'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RegisterJob',
          properties: {
            configFile: {
              title: 'configFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'ConfigFile',
                namespaceURI: ''
              }
            },
            job: {
              title: 'job',
              allOf: [
                {
                  $ref: '#/definitions/JobConfig'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Job',
                namespaceURI: ''
              }
            },
            sources: {
              title: 'sources',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfSourceOverride'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Sources',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            name: {
              title: 'name',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Name',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            },
            useRandomEncryptionType: {
              title: 'useRandomEncryptionType',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UseRandomEncryptionType',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RegisterJob',
        namespaceURI: ''
      },
      propertiesOrder: [
        'configFile',
        'job',
        'sources',
        'agent',
        'vault',
        'name',
        'portalMachine',
        'useRandomEncryptionType',
        'password'
      ]
    },
    PSLocalScript: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'PSLocalScript',
          properties: {
            winCmdlets: {
              title: 'winCmdlets',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'WinCmdlets',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'PSLocalScript',
        namespaceURI: ''
      },
      propertiesOrder: ['winCmdlets', 'agent']
    },
    Assign: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Assign',
          properties: {
            name: {
              title: 'name',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Name',
                namespaceURI: ''
              }
            },
            value: {
              title: 'value',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Value',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Assign',
        namespaceURI: ''
      },
      propertiesOrder: ['name', 'value']
    },
    CreateDir: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'CreateDir',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            dirName: {
              title: 'dirName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DirName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CreateDir',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'dirName']
    },
    VaultInfo: {
      type: 'object',
      title: 'VaultInfo',
      properties: {
        account: {
          title: 'account',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Account',
            namespaceURI: ''
          }
        },
        logon: {
          title: 'logon',
          allOf: [
            {
              $ref: '#/definitions/Credential'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Logon',
            namespaceURI: ''
          }
        },
        version: {
          title: 'version',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Version',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'VaultInfo',
        namespaceURI: ''
      },
      propertiesOrder: ['account', 'logon', 'version']
    },
    SetJobVVCProperty: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'SetJobVVCProperty',
          properties: {
            agentMachine: {
              title: 'agentMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'AgentMachine',
                namespaceURI: ''
              }
            },
            vvcPath: {
              title: 'vvcPath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VvcPath',
                namespaceURI: ''
              }
            },
            property: {
              title: 'property',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Property',
                namespaceURI: ''
              }
            },
            valueType: {
              title: 'valueType',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ValueType',
                namespaceURI: ''
              }
            },
            value: {
              title: 'value',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Value',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SetJobVVCProperty',
        namespaceURI: ''
      },
      propertiesOrder: ['agentMachine', 'vvcPath', 'property', 'valueType', 'value']
    },
    UpdateXmlValues: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'UpdateXmlValues',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            filePath: {
              title: 'filePath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePath',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'UpdateXmlValues',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'filePath']
    },
    CreateScriptFile: {
      required: ['run', 'runAsSystemAccount', 'waitForExit'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CreateScriptFile',
          properties: {
            scriptLines: {
              title: 'scriptLines',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'ScriptLines',
                namespaceURI: ''
              }
            },
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            filePath: {
              title: 'filePath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePath',
                namespaceURI: ''
              }
            },
            extension: {
              title: 'extension',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Extension',
                namespaceURI: ''
              }
            },
            exitCode: {
              title: 'exitCode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExitCode',
                namespaceURI: ''
              }
            },
            run: {
              title: 'run',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Run',
                namespaceURI: ''
              }
            },
            runAsSystemAccount: {
              title: 'runAsSystemAccount',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RunAsSystemAccount',
                namespaceURI: ''
              }
            },
            waitForExit: {
              title: 'waitForExit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'WaitForExit',
                namespaceURI: ''
              }
            },
            run32: {
              title: 'run32',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Run32',
                namespaceURI: ''
              }
            },
            encode: {
              title: 'encode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Encode',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CreateScriptFile',
        namespaceURI: ''
      },
      propertiesOrder: [
        'scriptLines',
        'remoteMachine',
        'filePath',
        'extension',
        'exitCode',
        'run',
        'runAsSystemAccount',
        'waitForExit',
        'run32',
        'encode'
      ]
    },
    SetVCenterCredentials: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'SetVCenterCredentials',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            username: {
              title: 'username',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Username',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SetVCenterCredentials',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'username', 'password']
    },
    VerifyRestoreToOriginalLocation: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyRestoreToOriginalLocation',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyRestoreToOriginalLocation',
        namespaceURI: ''
      }
    },
    SQLSchemaCompare: {
      required: ['iHaveAConfigFile', 'displayLog'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'SQLSchemaCompare',
          properties: {
            iHaveAConfigFile: {
              title: 'iHaveAConfigFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IHaveAConfigFile',
                namespaceURI: ''
              }
            },
            sqlServer1: {
              title: 'sqlServer1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SQLServer1',
                namespaceURI: ''
              }
            },
            user1: {
              title: 'user1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'User1',
                namespaceURI: ''
              }
            },
            password1: {
              title: 'password1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password1',
                namespaceURI: ''
              }
            },
            db1: {
              title: 'db1',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DB1',
                namespaceURI: ''
              }
            },
            sqlServer2: {
              title: 'sqlServer2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SQLServer2',
                namespaceURI: ''
              }
            },
            user2: {
              title: 'user2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'User2',
                namespaceURI: ''
              }
            },
            password2: {
              title: 'password2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password2',
                namespaceURI: ''
              }
            },
            db2: {
              title: 'db2',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DB2',
                namespaceURI: ''
              }
            },
            configFile: {
              title: 'configFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ConfigFile',
                namespaceURI: ''
              }
            },
            logName: {
              title: 'logName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogName',
                namespaceURI: ''
              }
            },
            displayLog: {
              title: 'displayLog',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DisplayLog',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SQLSchemaCompare',
        namespaceURI: ''
      },
      propertiesOrder: [
        'iHaveAConfigFile',
        'sqlServer1',
        'user1',
        'password1',
        'db1',
        'sqlServer2',
        'user2',
        'password2',
        'db2',
        'configFile',
        'logName',
        'displayLog'
      ]
    },
    Succeed: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Succeed',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Succeed',
        namespaceURI: ''
      }
    },
    Sync: {
      required: ['wait'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Sync',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            wait: {
              title: 'wait',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Wait',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Sync',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'jobName', 'wait']
    },
    UnixDosConversion: {
      required: ['conversionType', 'useSed'],
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'UnixDosConversion',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            conversionType: {
              title: 'conversionType',
              allOf: [
                {
                  $ref: '#/definitions/ConversionTypes'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ConversionType',
                namespaceURI: ''
              }
            },
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            useSed: {
              title: 'useSed',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UseSed',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'UnixDosConversion',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'conversionType', 'target', 'useSed']
    },
    CheckDumps: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckDumps',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            dumpMask: {
              title: 'dumpMask',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DumpMask',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckDumps',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'dumpMask']
    },
    SendEmail: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'SendEmail',
          properties: {
            fromMachine: {
              title: 'fromMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FromMachine',
                namespaceURI: ''
              }
            },
            fromEmail: {
              title: 'fromEmail',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FromEmail',
                namespaceURI: ''
              }
            },
            toEmail: {
              title: 'toEmail',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ToEmail',
                namespaceURI: ''
              }
            },
            subject: {
              title: 'subject',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Subject',
                namespaceURI: ''
              }
            },
            body: {
              title: 'body',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Body',
                namespaceURI: ''
              }
            },
            attachments: {
              title: 'attachments',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Attachments',
                namespaceURI: ''
              }
            },
            smtpServer: {
              title: 'smtpServer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SmtpServer',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SendEmail',
        namespaceURI: ''
      },
      propertiesOrder: ['fromMachine', 'fromEmail', 'toEmail', 'subject', 'body', 'attachments', 'smtpServer']
    },
    CompareFile: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CompareFile',
          properties: {
            files: {
              title: 'files',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Files',
                namespaceURI: ''
              }
            },
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            old: {
              title: 'old',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Old',
                namespaceURI: ''
              }
            },
            _new: {
              title: '_new',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'New',
                namespaceURI: ''
              }
            },
            _switch: {
              title: '_switch',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Switch',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CompareFile',
        namespaceURI: ''
      },
      propertiesOrder: ['files', 'target', 'old', '_new', '_switch']
    },
    PathManipulator: {
      type: 'object',
      title: 'PathManipulator',
      properties: {},
      typeType: 'classInfo',
      typeName: {
        localPart: 'PathManipulator',
        namespaceURI: ''
      }
    },
    Map: {
      type: 'object',
      title: 'Map',
      properties: {
        team: {
          title: 'team',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Team',
            namespaceURI: ''
          }
        },
        suite: {
          title: 'suite',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Suite',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Map',
        namespaceURI: ''
      },
      propertiesOrder: ['team', 'suite']
    },
    SourceOverride: {
      type: 'object',
      title: 'SourceOverride',
      required: ['source'],
      properties: {
        topLevelContainer: {
          title: 'topLevelContainer',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'TopLevelContainer',
            namespaceURI: ''
          }
        },
        include: {
          title: 'include',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfString'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Include',
            namespaceURI: ''
          }
        },
        exclude: {
          title: 'exclude',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfString'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Exclude',
            namespaceURI: ''
          }
        },
        parameters: {
          title: 'parameters',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfPair'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Parameters',
            namespaceURI: ''
          }
        },
        credentials: {
          title: 'credentials',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfString'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Credentials',
            namespaceURI: ''
          }
        },
        source: {
          title: 'source',
          allOf: [
            {
              $ref: '#/definitions/DataSourceType'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Source',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'SourceOverride',
        namespaceURI: ''
      },
      propertiesOrder: ['topLevelContainer', 'include', 'exclude', 'parameters', 'credentials', 'source']
    },
    VerifySyncLogForErrors: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifySyncLogForErrors',
          properties: {
            ignoreValidation: {
              title: 'ignoreValidation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IgnoreValidation',
                namespaceURI: ''
              }
            },
            ignoreConnectionErrors: {
              title: 'ignoreConnectionErrors',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IgnoreConnectionErrors',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifySyncLogForErrors',
        namespaceURI: ''
      },
      propertiesOrder: ['ignoreValidation', 'ignoreConnectionErrors']
    },
    ReplaceVMuuidInVVC: {
      required: ['wildCardsAndIndividualInclExclEnabled'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ReplaceVMuuidInVVC',
          properties: {
            wildCardInclusions: {
              title: 'wildCardInclusions',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'WildCardInclusions',
                namespaceURI: ''
              }
            },
            individualVMInclusions: {
              title: 'individualVMInclusions',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'IndividualVMInclusions',
                namespaceURI: ''
              }
            },
            wildCardExclusions: {
              title: 'wildCardExclusions',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'WildCardExclusions',
                namespaceURI: ''
              }
            },
            individualVMExclusions: {
              title: 'individualVMExclusions',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'IndividualVMExclusions',
                namespaceURI: ''
              }
            },
            vvcFile: {
              title: 'vvcFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VVCFile',
                namespaceURI: ''
              }
            },
            wildCardsAndIndividualInclExclEnabled: {
              title: 'wildCardsAndIndividualInclExclEnabled',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'WildCardsAndIndividualInclExclEnabled',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ReplaceVMuuidInVVC',
        namespaceURI: ''
      },
      propertiesOrder: [
        'wildCardInclusions',
        'individualVMInclusions',
        'wildCardExclusions',
        'individualVMExclusions',
        'vvcFile',
        'wildCardsAndIndividualInclExclEnabled'
      ]
    },
    AgentControl: {
      required: ['action'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'AgentControl',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            action: {
              title: 'action',
              allOf: [
                {
                  $ref: '#/definitions/Actions'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Action',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'AgentControl',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'action']
    },
    ParseFileUsingRegularExpression: {
      required: ['parseMethodLineByLine', 'expectedMatchCount', 'allMatchingFiles'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ParseFileUsingRegularExpression',
          properties: {
            parseMethodLineByLine: {
              title: 'parseMethodLineByLine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ParseMethodLineByLine',
                namespaceURI: ''
              }
            },
            filePathAndName: {
              title: 'filePathAndName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePathAndName',
                namespaceURI: ''
              }
            },
            patternString: {
              title: 'patternString',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PatternString',
                namespaceURI: ''
              }
            },
            matchOption: {
              title: 'matchOption',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'MatchOption',
                namespaceURI: ''
              }
            },
            expectedMatchCount: {
              title: 'expectedMatchCount',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedMatchCount',
                namespaceURI: ''
              }
            },
            filePath: {
              title: 'filePath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePath',
                namespaceURI: ''
              }
            },
            fileName: {
              title: 'fileName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileName',
                namespaceURI: ''
              }
            },
            allMatchingFiles: {
              title: 'allMatchingFiles',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'AllMatchingFiles',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ParseFileUsingRegularExpression',
        namespaceURI: ''
      },
      propertiesOrder: [
        'parseMethodLineByLine',
        'filePathAndName',
        'patternString',
        'matchOption',
        'expectedMatchCount',
        'filePath',
        'fileName',
        'allMatchingFiles'
      ]
    },
    VariableOfString: {
      allOf: [
        {
          $ref: '#/definitions/Variable'
        },
        {
          type: 'object',
          title: 'VariableOfString',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VariableOfString',
        namespaceURI: ''
      }
    },
    Credentials: {
      type: 'object',
      title: 'Credentials',
      required: ['passwordChanged'],
      properties: {
        method: {
          title: 'method',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'method',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        consumer: {
          title: 'consumer',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'consumer',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        username: {
          title: 'username',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'username',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        password: {
          title: 'password',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'password',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        passwordChanged: {
          title: 'passwordChanged',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'passwordChanged',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        domain: {
          title: 'domain',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'domain',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        profile: {
          title: 'profile',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'profile',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Credentials',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: [
        'method',
        'consumer',
        'username',
        'password',
        'passwordChanged',
        'domain',
        'profile',
        'customInfo'
      ]
    },
    'Machine.Extra': {
      type: 'object',
      title: 'Machine.Extra',
      required: ['any'],
      properties: {
        any: {
          title: 'any',
          allOf: [
            {
              type: 'object',
              properties: {
                name: {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
                },
                value: {}
              }
            }
          ],
          propertyType: 'anyElement'
        }
      },
      typeType: 'classInfo',
      propertiesOrder: ['any']
    },
    BMRestore: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'BMRestore',
          properties: {
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            },
            sourceAgent: {
              title: 'sourceAgent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SourceAgent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            encryptionPassword: {
              title: 'encryptionPassword',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'EncryptionPassword',
                namespaceURI: ''
              }
            },
            volumeMapping: {
              title: 'volumeMapping',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VolumeMapping',
                namespaceURI: ''
              }
            },
            snapshotID: {
              title: 'snapshotID',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SnapshotID',
                namespaceURI: ''
              }
            },
            restoreJobLogDir: {
              title: 'restoreJobLogDir',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RestoreJobLogDir',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'BMRestore',
        namespaceURI: ''
      },
      propertiesOrder: [
        'targetMachine',
        'sourceAgent',
        'jobName',
        'encryptionPassword',
        'volumeMapping',
        'snapshotID',
        'restoreJobLogDir'
      ]
    },
    Team: {
      type: 'object',
      title: 'Team',
      required: ['tLinkPlatformID', 'x64'],
      properties: {
        machines: {
          title: 'machines',
          allOf: [
            {
              $ref: '#/definitions/Team.Machines'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Machines',
            namespaceURI: ''
          }
        },
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Name',
            namespaceURI: ''
          }
        },
        tLinkPlatformID: {
          title: 'tLinkPlatformID',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'TLinkPlatformID',
            namespaceURI: ''
          }
        },
        x64: {
          title: 'x64',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'X64',
            namespaceURI: ''
          }
        },
        osType: {
          title: 'osType',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'OSType',
            namespaceURI: ''
          }
        },
        providerId: {
          title: 'providerId',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ProviderId',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Team',
        namespaceURI: ''
      },
      propertiesOrder: ['machines', 'name', 'tLinkPlatformID', 'x64', 'osType', 'providerId']
    },
    JobSource: {
      type: 'object',
      title: 'JobSource',
      properties: {
        dataSource: {
          title: 'dataSource',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'dataSource',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        topLevelContainer: {
          title: 'topLevelContainer',
          allOf: [
            {
              $ref: '#/definitions/ObjectSpec'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'topLevelContainer',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        include: {
          title: 'include',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/ObjectSelector'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'include',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        exclude: {
          title: 'exclude',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/ObjectSelector'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'exclude',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        parameters: {
          title: 'parameters',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Pair'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'parameters',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        credentials: {
          title: 'credentials',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Credentials'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'credentials',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'JobSource',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: [
        'dataSource',
        'topLevelContainer',
        'include',
        'exclude',
        'parameters',
        'credentials',
        'customInfo'
      ]
    },
    PSScriptEx2010Cmdlets: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'PSScriptEx2010Cmdlets',
          properties: {
            exCmdlets: {
              title: 'exCmdlets',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'ExCmdlets',
                namespaceURI: ''
              }
            },
            onMachine: {
              title: 'onMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'PSScriptEx2010Cmdlets',
        namespaceURI: ''
      },
      propertiesOrder: ['exCmdlets', 'onMachine']
    },
    ArrayOfMap: {
      type: 'object',
      title: 'ArrayOfMap',
      properties: {
        map: {
          title: 'map',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Map'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Map',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfMap',
        namespaceURI: ''
      },
      propertiesOrder: ['map']
    },
    ArrayOfVolume: {
      type: 'object',
      title: 'ArrayOfVolume',
      properties: {
        volume: {
          title: 'volume',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Volume'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Volume',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfVolume',
        namespaceURI: ''
      },
      propertiesOrder: ['volume']
    },
    'VM.Extra': {
      type: 'object',
      title: 'VM.Extra',
      required: ['any'],
      properties: {
        any: {
          title: 'any',
          allOf: [
            {
              type: 'object',
              properties: {
                name: {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
                },
                value: {}
              }
            }
          ],
          propertyType: 'anyElement'
        }
      },
      typeType: 'classInfo',
      propertiesOrder: ['any']
    },
    ThrottleAgent: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ThrottleAgent',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            days: {
              title: 'days',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Days',
                namespaceURI: ''
              }
            },
            enabled: {
              title: 'enabled',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Enabled',
                namespaceURI: ''
              }
            },
            bandwidth: {
              title: 'bandwidth',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Bandwidth',
                namespaceURI: ''
              }
            },
            startTime: {
              title: 'startTime',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'StartTime',
                namespaceURI: ''
              }
            },
            endTime: {
              title: 'endTime',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'EndTime',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ThrottleAgent',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'days', 'enabled', 'bandwidth', 'startTime', 'endTime']
    },
    VerifyLogHasZeroDeltizedBytes: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyLogHasZeroDeltizedBytes',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyLogHasZeroDeltizedBytes',
        namespaceURI: ''
      }
    },
    GenerateFile: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'GenerateFile',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            path: {
              title: 'path',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Path',
                namespaceURI: ''
              }
            },
            fileName: {
              title: 'fileName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileName',
                namespaceURI: ''
              }
            },
            fileSizeInKb: {
              title: 'fileSizeInKb',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileSizeInKb',
                namespaceURI: ''
              }
            },
            compressible: {
              title: 'compressible',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Compressible',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'GenerateFile',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'path', 'fileName', 'fileSizeInKb', 'compressible']
    },
    UnregisterJob: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'UnregisterJob',
          properties: {
            job: {
              title: 'job',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Job',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'UnregisterJob',
        namespaceURI: ''
      },
      propertiesOrder: ['job', 'agent', 'vault', 'portalMachine']
    },
    DeleteSafeset: {
      required: ['safesetId'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DeleteSafeset',
          properties: {
            safesetId: {
              title: 'safesetId',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/unsignedInt'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'SafesetId',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DeleteSafeset',
        namespaceURI: ''
      },
      propertiesOrder: ['safesetId', 'vault', 'agent', 'jobName']
    },
    DebugNext: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DebugNext',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DebugNext',
        namespaceURI: ''
      }
    },
    VerifyLogForMessages: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'VerifyLogForMessages',
          properties: {
            messages: {
              title: 'messages',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfMessage'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Messages',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'VerifyLogForMessages',
        namespaceURI: ''
      },
      propertiesOrder: ['messages']
    },
    IsAgentRegisteredToVault: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'IsAgentRegisteredToVault',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            shouldFail: {
              title: 'shouldFail',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ShouldFail',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'IsAgentRegisteredToVault',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'vault', 'shouldFail']
    },
    SystemCommand: {
      required: ['waitForExit'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'SystemCommand',
          properties: {
            programRunnerTimeLimit: {
              title: 'programRunnerTimeLimit',
              allOf: [
                {
                  $ref: '#/definitions/TimeLimit'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'ProgramRunnerTimeLimit',
                namespaceURI: ''
              }
            },
            command: {
              title: 'command',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Command',
                namespaceURI: ''
              }
            },
            arguments: {
              title: 'arguments',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Arguments',
                namespaceURI: ''
              }
            },
            waitForExit: {
              title: 'waitForExit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'WaitForExit',
                namespaceURI: ''
              }
            },
            exitCode: {
              title: 'exitCode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExitCode',
                namespaceURI: ''
              }
            },
            onIteration: {
              title: 'onIteration',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OnIteration',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SystemCommand',
        namespaceURI: ''
      },
      propertiesOrder: ['programRunnerTimeLimit', 'command', 'arguments', 'waitForExit', 'exitCode', 'onIteration']
    },
    CountSafesetsOnVault: {
      required: ['expectedNumberOfSafesets'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CountSafesetsOnVault',
          properties: {
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vaultComputerName: {
              title: 'vaultComputerName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VaultComputerName',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            expectedNumberOfSafesets: {
              title: 'expectedNumberOfSafesets',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedNumberOfSafesets',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CountSafesetsOnVault',
        namespaceURI: ''
      },
      propertiesOrder: ['vault', 'agent', 'vaultComputerName', 'jobName', 'expectedNumberOfSafesets']
    },
    ReplaceRegistrationHostUuidInVPR: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ReplaceRegistrationHostUuidInVPR',
          properties: {
            vprFile: {
              title: 'vprFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VPRFile',
                namespaceURI: ''
              }
            },
            targetVM: {
              title: 'targetVM',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetVM',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ReplaceRegistrationHostUuidInVPR',
        namespaceURI: ''
      },
      propertiesOrder: ['vprFile', 'targetVM']
    },
    Test: {
      type: 'object',
      title: 'Test',
      required: ['tLinkTID', 'dontSendResult', 'dontSkip', 'abortSuiteOnFail'],
      properties: {
        setup: {
          title: 'setup',
          allOf: [
            {
              $ref: '#/definitions/CommandList'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Setup',
            namespaceURI: ''
          }
        },
        commands: {
          title: 'commands',
          allOf: [
            {
              $ref: '#/definitions/CommandList'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Commands',
            namespaceURI: ''
          }
        },
        teardown: {
          title: 'teardown',
          allOf: [
            {
              $ref: '#/definitions/CommandList'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Teardown',
            namespaceURI: ''
          }
        },
        variables: {
          title: 'variables',
          allOf: [
            {
              $ref: '#/definitions/Test.Variables'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Variables',
            namespaceURI: ''
          }
        },
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Name',
            namespaceURI: ''
          }
        },
        owner: {
          title: 'owner',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Owner',
            namespaceURI: ''
          }
        },
        tLinkTID: {
          title: 'tLinkTID',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'TLinkTID',
            namespaceURI: ''
          }
        },
        tLinkPID: {
          title: 'tLinkPID',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'TLinkPID',
            namespaceURI: ''
          }
        },
        dontSendResult: {
          title: 'dontSendResult',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'DontSendResult',
            namespaceURI: ''
          }
        },
        dontSkip: {
          title: 'dontSkip',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'DontSkip',
            namespaceURI: ''
          }
        },
        abortSuiteOnFail: {
          title: 'abortSuiteOnFail',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'AbortSuiteOnFail',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Test',
        namespaceURI: ''
      },
      propertiesOrder: [
        'setup',
        'commands',
        'teardown',
        'variables',
        'name',
        'owner',
        'tLinkTID',
        'tLinkPID',
        'dontSendResult',
        'dontSkip',
        'abortSuiteOnFail'
      ]
    },
    CreateExchangeMailbox: {
      required: ['nbMailboxes'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CreateExchangeMailbox',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            dbName: {
              title: 'dbName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DBName',
                namespaceURI: ''
              }
            },
            baseUserName: {
              title: 'baseUserName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'BaseUserName',
                namespaceURI: ''
              }
            },
            password: {
              title: 'password',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Password',
                namespaceURI: ''
              }
            },
            atDomain: {
              title: 'atDomain',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'AtDomain',
                namespaceURI: ''
              }
            },
            nbMailboxes: {
              title: 'nbMailboxes',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NbMailboxes',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CreateExchangeMailbox',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'dbName', 'baseUserName', 'password', 'atDomain', 'nbMailboxes']
    },
    CheckDeferralResume: {
      required: ['sql'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckDeferralResume',
          properties: {
            sql: {
              title: 'sql',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Sql',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckDeferralResume',
        namespaceURI: ''
      },
      propertiesOrder: ['sql']
    },
    CheckCompressedBytesRatio: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckCompressedBytesRatio',
          properties: {
            ratio: {
              title: 'ratio',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Ratio',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckCompressedBytesRatio',
        namespaceURI: ''
      },
      propertiesOrder: ['ratio']
    },
    RecordLogExecutionTime: {
      required: ['checkLatestLog'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RecordLogExecutionTime',
          properties: {
            logName: {
              title: 'logName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogName',
                namespaceURI: ''
              }
            },
            checkLatestLog: {
              title: 'checkLatestLog',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CheckLatestLog',
                namespaceURI: ''
              }
            },
            outputFile: {
              title: 'outputFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OutputFile',
                namespaceURI: ''
              }
            },
            lineFormatting: {
              title: 'lineFormatting',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LineFormatting',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RecordLogExecutionTime',
        namespaceURI: ''
      },
      propertiesOrder: ['logName', 'checkLatestLog', 'outputFile', 'lineFormatting']
    },
    UnregisterAgent: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'UnregisterAgent',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            retryCycles: {
              title: 'retryCycles',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RetryCycles',
                namespaceURI: ''
              }
            },
            retryLength: {
              title: 'retryLength',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RetryLength',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'UnregisterAgent',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'vault', 'retryCycles', 'retryLength']
    },
    StopRecordingAndCheckNetworkUsage: {
      required: ['max', 'min'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'StopRecordingAndCheckNetworkUsage',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            counterName: {
              title: 'counterName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CounterName',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            max: {
              title: 'max',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Max',
                namespaceURI: ''
              }
            },
            min: {
              title: 'min',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Min',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'StopRecordingAndCheckNetworkUsage',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'counterName', 'jobName', 'max', 'min']
    },
    SetGlobalVVCProperty: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'SetGlobalVVCProperty',
          properties: {
            agentMachine: {
              title: 'agentMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'AgentMachine',
                namespaceURI: ''
              }
            },
            vvcPath: {
              title: 'vvcPath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'VvcPath',
                namespaceURI: ''
              }
            },
            property: {
              title: 'property',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Property',
                namespaceURI: ''
              }
            },
            valueType: {
              title: 'valueType',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ValueType',
                namespaceURI: ''
              }
            },
            value: {
              title: 'value',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Value',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SetGlobalVVCProperty',
        namespaceURI: ''
      },
      propertiesOrder: ['agentMachine', 'vvcPath', 'property', 'valueType', 'value']
    },
    WinPathManipulator: {
      allOf: [
        {
          $ref: '#/definitions/PathManipulator'
        },
        {
          type: 'object',
          title: 'WinPathManipulator',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'WinPathManipulator',
        namespaceURI: ''
      }
    },
    ReplaceVMuuidInJson: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ReplaceVMuuidInJson',
          properties: {
            vmNames: {
              title: 'vmNames',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'VMNames',
                namespaceURI: ''
              }
            },
            jsonFile: {
              title: 'jsonFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JsonFile',
                namespaceURI: ''
              }
            },
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            },
            jsonFilePurpose: {
              title: 'jsonFilePurpose',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JsonFilePurpose',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ReplaceVMuuidInJson',
        namespaceURI: ''
      },
      propertiesOrder: ['vmNames', 'jsonFile', 'agent', 'portalMachine', 'jsonFilePurpose']
    },
    ChangeTime: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ChangeTime',
          properties: {
            targetMachine: {
              title: 'targetMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TargetMachine',
                namespaceURI: ''
              }
            },
            action: {
              title: 'action',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Action',
                namespaceURI: ''
              }
            },
            newTime12HFormat: {
              title: 'newTime12HFormat',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NewTime12HFormat',
                namespaceURI: ''
              }
            },
            newTimeZone: {
              title: 'newTimeZone',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NewTimeZone',
                namespaceURI: ''
              }
            },
            dst: {
              title: 'dst',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DST',
                namespaceURI: ''
              }
            },
            internetSynch: {
              title: 'internetSynch',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'InternetSynch',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ChangeTime',
        namespaceURI: ''
      },
      propertiesOrder: ['targetMachine', 'action', 'newTime12HFormat', 'newTimeZone', 'dst', 'internetSynch']
    },
    RunCommand: {
      type: 'object',
      title: 'RunCommand',
      required: ['waitForExit', 'exitCode', 'isRemote', 'iteration'],
      properties: {
        path: {
          title: 'path',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Path',
            namespaceURI: ''
          }
        },
        commandName: {
          title: 'commandName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'CommandName',
            namespaceURI: ''
          }
        },
        commandArgs: {
          title: 'commandArgs',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'CommandArgs',
            namespaceURI: ''
          }
        },
        waitForExit: {
          title: 'waitForExit',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'WaitForExit',
            namespaceURI: ''
          }
        },
        exitCode: {
          title: 'exitCode',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ExitCode',
            namespaceURI: ''
          }
        },
        isRemote: {
          title: 'isRemote',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'IsRemote',
            namespaceURI: ''
          }
        },
        iteration: {
          title: 'iteration',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Iteration',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'RunCommand',
        namespaceURI: ''
      },
      propertiesOrder: ['path', 'commandName', 'commandArgs', 'waitForExit', 'exitCode', 'isRemote', 'iteration']
    },
    ControlExchangeDatabase: {
      required: ['server'],
      allOf: [
        {
          $ref: '#/definitions/RemoteSystemCommand'
        },
        {
          type: 'object',
          title: 'ControlExchangeDatabase',
          properties: {
            database: {
              title: 'database',
              allOf: [
                {
                  $ref: '#/definitions/ExchangeDatabase'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Database',
                namespaceURI: ''
              }
            },
            server: {
              title: 'server',
              allOf: [
                {
                  $ref: '#/definitions/ExchangeServerVersions'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Server',
                namespaceURI: ''
              }
            },
            location: {
              title: 'location',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Location',
                namespaceURI: ''
              }
            },
            action: {
              title: 'action',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Action',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ControlExchangeDatabase',
        namespaceURI: ''
      },
      propertiesOrder: ['database', 'server', 'location', 'action']
    },
    HashLogger: {
      required: ['type'],
      allOf: [
        {
          $ref: '#/definitions/RemoteSystemCommand'
        },
        {
          type: 'object',
          title: 'HashLogger',
          properties: {
            type: {
              title: 'type',
              allOf: [
                {
                  $ref: '#/definitions/HashLoggerTypes'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Type',
                namespaceURI: ''
              }
            },
            logName: {
              title: 'logName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogName',
                namespaceURI: ''
              }
            },
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            uncUser: {
              title: 'uncUser',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UNCUser',
                namespaceURI: ''
              }
            },
            uncPassword: {
              title: 'uncPassword',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'UNCPassword',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'HashLogger',
        namespaceURI: ''
      },
      propertiesOrder: ['type', 'logName', 'machine', 'uncUser', 'uncPassword']
    },
    Loop: {
      required: ['times'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Loop',
          properties: {
            commands: {
              title: 'commands',
              allOf: [
                {
                  $ref: '#/definitions/CommandList'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Commands',
                namespaceURI: ''
              }
            },
            times: {
              title: 'times',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Times',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Loop',
        namespaceURI: ''
      },
      propertiesOrder: ['commands', 'times']
    },
    PSPropertyInfo: {
      allOf: [
        {
          $ref: '#/definitions/PSMemberInfo'
        },
        {
          type: 'object',
          title: 'PSPropertyInfo',
          properties: {}
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'PSPropertyInfo',
        namespaceURI: ''
      }
    },
    DeleteVSSSnapshots: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'DeleteVSSSnapshots',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'DeleteVSSSnapshots',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine']
    },
    InstallAgent: {
      required: ['installLanguage'],
      allOf: [
        {
          $ref: '#/definitions/CopyFiles'
        },
        {
          type: 'object',
          title: 'InstallAgent',
          properties: {
            installScript: {
              title: 'installScript',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'InstallScript',
                namespaceURI: ''
              }
            },
            setupProgram: {
              title: 'setupProgram',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'SetupProgram',
                namespaceURI: ''
              }
            },
            targetOS: {
              title: 'targetOS',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfOperatingSystems'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'TargetOS',
                namespaceURI: ''
              }
            },
            installLanguage: {
              title: 'installLanguage',
              allOf: [
                {
                  $ref: '#/definitions/LanguageCode'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'InstallLanguage',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'InstallAgent',
        namespaceURI: ''
      },
      propertiesOrder: ['installScript', 'setupProgram', 'targetOS', 'installLanguage']
    },
    ArrayOfPair: {
      type: 'object',
      title: 'ArrayOfPair',
      properties: {
        pair: {
          title: 'pair',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/Pair'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Pair',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfPair',
        namespaceURI: ''
      },
      propertiesOrder: ['pair']
    },
    Plan: {
      type: 'object',
      title: 'Plan',
      required: ['sendResultsToTlink', 'sendFailuresToOwner'],
      properties: {
        steps: {
          title: 'steps',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfMap'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Steps',
            namespaceURI: ''
          }
        },
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Name',
            namespaceURI: ''
          }
        },
        sendResultsToTlink: {
          title: 'sendResultsToTlink',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'SendResultsToTlink',
            namespaceURI: ''
          }
        },
        sendFailuresToOwner: {
          title: 'sendFailuresToOwner',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'SendFailuresToOwner',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Plan',
        namespaceURI: ''
      },
      propertiesOrder: ['steps', 'name', 'sendResultsToTlink', 'sendFailuresToOwner']
    },
    GetFileVersion: {
      required: ['isInstallKit'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'GetFileVersion',
          properties: {
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            filePath: {
              title: 'filePath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePath',
                namespaceURI: ''
              }
            },
            fileName: {
              title: 'fileName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileName',
                namespaceURI: ''
              }
            },
            isInstallKit: {
              title: 'isInstallKit',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'IsInstallKit',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'GetFileVersion',
        namespaceURI: ''
      },
      propertiesOrder: ['target', 'filePath', 'fileName', 'isInstallKit']
    },
    RecordCommandsExecutionTime: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RecordCommandsExecutionTime',
          properties: {
            commands: {
              title: 'commands',
              allOf: [
                {
                  $ref: '#/definitions/CommandList'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Commands',
                namespaceURI: ''
              }
            },
            outputFile: {
              title: 'outputFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'OutputFile',
                namespaceURI: ''
              }
            },
            lineFormatting: {
              title: 'lineFormatting',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LineFormatting',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RecordCommandsExecutionTime',
        namespaceURI: ''
      },
      propertiesOrder: ['commands', 'outputFile', 'lineFormatting']
    },
    PSMethodInfo: {
      allOf: [
        {
          $ref: '#/definitions/PSMemberInfo'
        },
        {
          type: 'object',
          title: 'PSMethodInfo',
          properties: {
            overloadDefinitions: {
              title: 'overloadDefinitions',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'OverloadDefinitions',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'PSMethodInfo',
        namespaceURI: ''
      },
      propertiesOrder: ['overloadDefinitions']
    },
    Echo: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'Echo',
          properties: {
            message: {
              title: 'message',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Message',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'Echo',
        namespaceURI: ''
      },
      propertiesOrder: ['message']
    },
    ExecuteSSHCommandSet: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'ExecuteSSHCommandSet',
          properties: {
            commands: {
              title: 'commands',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfCommandWithPrompt'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Commands',
                namespaceURI: ''
              }
            },
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            welcomePrompt: {
              title: 'welcomePrompt',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'WelcomePrompt',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ExecuteSSHCommandSet',
        namespaceURI: ''
      },
      propertiesOrder: ['commands', 'remoteMachine', 'welcomePrompt']
    },
    Message: {
      type: 'object',
      title: 'Message',
      required: ['id'],
      properties: {
        parameters: {
          title: 'parameters',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfParameter'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Parameters',
            namespaceURI: ''
          }
        },
        id: {
          title: 'id',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ID',
            namespaceURI: ''
          }
        },
        severity: {
          title: 'severity',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Severity',
            namespaceURI: ''
          }
        },
        count: {
          title: 'count',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Count',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Message',
        namespaceURI: ''
      },
      propertiesOrder: ['parameters', 'id', 'severity', 'count']
    },
    RegisterEnvironment: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RegisterEnvironment',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            currentName: {
              title: 'currentName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'CurrentName',
                namespaceURI: ''
              }
            },
            newName: {
              title: 'newName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'NewName',
                namespaceURI: ''
              }
            },
            envUsername: {
              title: 'envUsername',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'EnvUsername',
                namespaceURI: ''
              }
            },
            envPassword: {
              title: 'envPassword',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'EnvPassword',
                namespaceURI: ''
              }
            },
            portalMachine: {
              title: 'portalMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'PortalMachine',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RegisterEnvironment',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'currentName', 'newName', 'envUsername', 'envPassword', 'portalMachine']
    },
    CreateExchangeRecoveryDB: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CreateExchangeRecoveryDB',
          properties: {
            optionsFile: {
              title: 'optionsFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'OptionsFile',
                namespaceURI: ''
              }
            },
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            dbName: {
              title: 'dbName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DBName',
                namespaceURI: ''
              }
            },
            edbLocation: {
              title: 'edbLocation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'EDBLocation',
                namespaceURI: ''
              }
            },
            logsLocation: {
              title: 'logsLocation',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogsLocation',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CreateExchangeRecoveryDB',
        namespaceURI: ''
      },
      propertiesOrder: ['optionsFile', 'remoteMachine', 'dbName', 'edbLocation', 'logsLocation']
    },
    ReadFiles: {
      allOf: [
        {
          $ref: '#/definitions/SystemCommand'
        },
        {
          type: 'object',
          title: 'ReadFiles',
          properties: {
            ranges: {
              title: 'ranges',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'Ranges',
                namespaceURI: ''
              }
            },
            agentMachine: {
              title: 'agentMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'AgentMachine',
                namespaceURI: ''
              }
            },
            path: {
              title: 'path',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Path',
                namespaceURI: ''
              }
            },
            logFolder: {
              title: 'logFolder',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'LogFolder',
                namespaceURI: ''
              }
            },
            filesLogFolder: {
              title: 'filesLogFolder',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilesLogFolder',
                namespaceURI: ''
              }
            },
            filesLogFile: {
              title: 'filesLogFile',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilesLogFile',
                namespaceURI: ''
              }
            },
            flag: {
              title: 'flag',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Flag',
                namespaceURI: ''
              }
            },
            dynamic: {
              title: 'dynamic',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Dynamic',
                namespaceURI: ''
              }
            },
            totalSizeInKb: {
              title: 'totalSizeInKb',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TotalSizeInKb',
                namespaceURI: ''
              }
            },
            comment: {
              title: 'comment',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Comment',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'ReadFiles',
        namespaceURI: ''
      },
      propertiesOrder: [
        'ranges',
        'agentMachine',
        'path',
        'logFolder',
        'filesLogFolder',
        'filesLogFile',
        'flag',
        'dynamic',
        'totalSizeInKb',
        'comment'
      ]
    },
    RecordResultToTestlink: {
      required: ['testCaseID', 'testCaseResult'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'RecordResultToTestlink',
          properties: {
            testCaseID: {
              title: 'testCaseID',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TestCaseID',
                namespaceURI: ''
              }
            },
            testCaseResult: {
              title: 'testCaseResult',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TestCaseResult',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'RecordResultToTestlink',
        namespaceURI: ''
      },
      propertiesOrder: ['testCaseID', 'testCaseResult']
    },
    BaseCommand: {
      type: 'object',
      title: 'BaseCommand',
      required: ['delay', 'isCritical', 'continueIfFailed', 'retries', 'retrySleep'],
      properties: {
        delay: {
          title: 'delay',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Delay',
            namespaceURI: ''
          }
        },
        outVar: {
          title: 'outVar',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/OutVar'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'OutVar',
            namespaceURI: ''
          }
        },
        delayXmlAttribute: {
          title: 'delayXmlAttribute',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'DelayXmlAttribute',
            namespaceURI: ''
          }
        },
        description: {
          title: 'description',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Description',
            namespaceURI: ''
          }
        },
        isCritical: {
          title: 'isCritical',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'IsCritical',
            namespaceURI: ''
          }
        },
        continueIfFailed: {
          title: 'continueIfFailed',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'ContinueIfFailed',
            namespaceURI: ''
          }
        },
        retries: {
          title: 'retries',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Retries',
            namespaceURI: ''
          }
        },
        retrySleep: {
          title: 'retrySleep',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'RetrySleep',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'BaseCommand',
        namespaceURI: ''
      },
      propertiesOrder: [
        'delay',
        'outVar',
        'delayXmlAttribute',
        'description',
        'isCritical',
        'continueIfFailed',
        'retries',
        'retrySleep'
      ]
    },
    ScheduleOptions: {
      type: 'object',
      title: 'ScheduleOptions',
      required: ['deferAfter', 'deltaProcessing', 'quickFileScan', 'deleteDataSourceLogs'],
      properties: {
        deferAfter: {
          title: 'deferAfter',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'deferAfter',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        deltaProcessing: {
          title: 'deltaProcessing',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'deltaProcessing',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        quickFileScan: {
          title: 'quickFileScan',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'quickFileScan',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        retention: {
          title: 'retention',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'retention',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        compressionLevel: {
          title: 'compressionLevel',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'compressionLevel',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        backupType: {
          title: 'backupType',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'backupType',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        deleteDataSourceLogs: {
          title: 'deleteDataSourceLogs',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'deleteDataSourceLogs',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        },
        customInfo: {
          title: 'customInfo',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/CustomObject'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'customInfo',
            namespaceURI: 'urn:agent-management-data-structures'
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ScheduleOptions',
        namespaceURI: 'urn:agent-management-data-structures'
      },
      propertiesOrder: [
        'deferAfter',
        'deltaProcessing',
        'quickFileScan',
        'retention',
        'compressionLevel',
        'backupType',
        'deleteDataSourceLogs',
        'customInfo'
      ]
    },
    Machine: {
      type: 'object',
      title: 'Machine',
      required: ['type', 'initializationPriority', 'exchangeServerVersion', 'operatingSystem', 'raMinMB'],
      properties: {
        type: {
          title: 'type',
          allOf: [
            {
              $ref: '#/definitions/MachineTypes'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Type',
            namespaceURI: ''
          }
        },
        initializationPriority: {
          title: 'initializationPriority',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'InitializationPriority',
            namespaceURI: ''
          }
        },
        volumes: {
          title: 'volumes',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfVolume'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Volumes',
            namespaceURI: ''
          }
        },
        exchangeServerVersion: {
          title: 'exchangeServerVersion',
          allOf: [
            {
              $ref: '#/definitions/ExchangeServerVersions'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'ExchangeServerVersion',
            namespaceURI: ''
          }
        },
        exchangeServerName: {
          title: 'exchangeServerName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'ExchangeServerName',
            namespaceURI: ''
          }
        },
        exchangeDatabases: {
          title: 'exchangeDatabases',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfExchangeDatabase'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'ExchangeDatabases',
            namespaceURI: ''
          }
        },
        operatingSystem: {
          title: 'operatingSystem',
          allOf: [
            {
              $ref: '#/definitions/OperatingSystems'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'OperatingSystem',
            namespaceURI: ''
          }
        },
        subnet: {
          title: 'subnet',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Subnet',
            namespaceURI: ''
          }
        },
        address: {
          title: 'address',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Address',
            namespaceURI: ''
          }
        },
        mac: {
          title: 'mac',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Mac',
            namespaceURI: ''
          }
        },
        physicalAddress: {
          title: 'physicalAddress',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'PhysicalAddress',
            namespaceURI: ''
          }
        },
        fileSystem: {
          title: 'fileSystem',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'FileSystem',
            namespaceURI: ''
          }
        },
        driveLetter: {
          title: 'driveLetter',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'DriveLetter',
            namespaceURI: ''
          }
        },
        raMinMB: {
          title: 'raMinMB',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'RAMinMB',
            namespaceURI: ''
          }
        },
        locations: {
          title: 'locations',
          allOf: [
            {
              $ref: '#/definitions/Machine.Locations'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Locations',
            namespaceURI: ''
          }
        },
        agentDetails: {
          title: 'agentDetails',
          allOf: [
            {
              $ref: '#/definitions/AgentInfo'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'AgentDetails',
            namespaceURI: ''
          }
        },
        vaultDetails: {
          title: 'vaultDetails',
          allOf: [
            {
              $ref: '#/definitions/VaultInfo'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'VaultDetails',
            namespaceURI: ''
          }
        },
        logon: {
          title: 'logon',
          allOf: [
            {
              $ref: '#/definitions/Credential'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Logon',
            namespaceURI: ''
          }
        },
        credentials: {
          title: 'credentials',
          allOf: [
            {
              $ref: '#/definitions/Machine.Credentials'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Credentials',
            namespaceURI: ''
          }
        },
        vmSettings: {
          title: 'vmSettings',
          allOf: [
            {
              $ref: '#/definitions/VM'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'VMSettings',
            namespaceURI: ''
          }
        },
        portalCredentials: {
          title: 'portalCredentials',
          allOf: [
            {
              $ref: '#/definitions/Credential'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'PortalCredentials',
            namespaceURI: ''
          }
        },
        extra: {
          title: 'extra',
          allOf: [
            {
              $ref: '#/definitions/Machine.Extra'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Extra',
            namespaceURI: ''
          }
        },
        name: {
          title: 'name',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Name',
            namespaceURI: ''
          }
        },
        agentName: {
          title: 'agentName',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'AgentName',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'Machine',
        namespaceURI: ''
      },
      propertiesOrder: [
        'type',
        'initializationPriority',
        'volumes',
        'exchangeServerVersion',
        'exchangeServerName',
        'exchangeDatabases',
        'operatingSystem',
        'subnet',
        'address',
        'mac',
        'physicalAddress',
        'fileSystem',
        'driveLetter',
        'raMinMB',
        'locations',
        'agentDetails',
        'vaultDetails',
        'logon',
        'credentials',
        'vmSettings',
        'portalCredentials',
        'extra',
        'name',
        'agentName'
      ]
    },
    PSRemoteScript: {
      required: ['x86'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'PSRemoteScript',
          properties: {
            winCmdlets: {
              title: 'winCmdlets',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfString'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'WinCmdlets',
                namespaceURI: ''
              }
            },
            results: {
              title: 'results',
              allOf: [
                {
                  $ref: '#/definitions/ArrayOfPSObject'
                }
              ],
              propertyType: 'element',
              elementName: {
                localPart: 'results',
                namespaceURI: ''
              }
            },
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            x86: {
              title: 'x86',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'X86',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'PSRemoteScript',
        namespaceURI: ''
      },
      propertiesOrder: ['winCmdlets', 'results', 'remoteMachine', 'x86']
    },
    CompareFileVersion: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CompareFileVersion',
          properties: {
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            filePath: {
              title: 'filePath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePath',
                namespaceURI: ''
              }
            },
            fileName: {
              title: 'fileName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileName',
                namespaceURI: ''
              }
            },
            fileVersionString: {
              title: 'fileVersionString',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileVersionString',
                namespaceURI: ''
              }
            },
            fileVersionMajor: {
              title: 'fileVersionMajor',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileVersionMajor',
                namespaceURI: ''
              }
            },
            fileVersionMinor: {
              title: 'fileVersionMinor',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileVersionMinor',
                namespaceURI: ''
              }
            },
            fileVersionBuild: {
              title: 'fileVersionBuild',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileVersionBuild',
                namespaceURI: ''
              }
            },
            fileVersionPrivate: {
              title: 'fileVersionPrivate',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FileVersionPrivate',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CompareFileVersion',
        namespaceURI: ''
      },
      propertiesOrder: [
        'target',
        'filePath',
        'fileName',
        'fileVersionString',
        'fileVersionMajor',
        'fileVersionMinor',
        'fileVersionBuild',
        'fileVersionPrivate'
      ]
    },
    ScraperConfig: {
      type: 'object',
      title: 'ScraperConfig',
      properties: {
        masterConfigPath: {
          title: 'masterConfigPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'MasterConfigPath',
            namespaceURI: ''
          }
        },
        workingPath: {
          title: 'workingPath',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'WorkingPath',
            namespaceURI: ''
          }
        },
        files: {
          title: 'files',
          allOf: [
            {
              $ref: '#/definitions/ArrayOfString'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'Files',
            namespaceURI: ''
          }
        },
        expectedMatches: {
          title: 'expectedMatches',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'ExpectedMatches',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ScraperConfig',
        namespaceURI: ''
      },
      propertiesOrder: ['masterConfigPath', 'workingPath', 'files', 'expectedMatches']
    },
    'Credential.Extra': {
      type: 'object',
      title: 'Credential.Extra',
      required: ['any'],
      properties: {
        any: {
          title: 'any',
          allOf: [
            {
              type: 'object',
              properties: {
                name: {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
                },
                value: {}
              }
            }
          ],
          propertyType: 'anyElement'
        }
      },
      typeType: 'classInfo',
      propertiesOrder: ['any']
    },
    ArrayOfOperatingSystems: {
      type: 'object',
      title: 'ArrayOfOperatingSystems',
      properties: {
        operatingSystems: {
          title: 'operatingSystems',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/OperatingSystems'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'OperatingSystems',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfOperatingSystems',
        namespaceURI: ''
      },
      propertiesOrder: ['operatingSystems']
    },
    ArrayOfBackupOptions: {
      type: 'object',
      title: 'ArrayOfBackupOptions',
      properties: {
        backupOptions: {
          title: 'backupOptions',
          allOf: [
            {
              type: 'array',
              items: {
                $ref: '#/definitions/BackupOptions'
              },
              minItems: 0
            }
          ],
          propertyType: 'element',
          elementName: {
            localPart: 'BackupOptions',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'ArrayOfBackupOptions',
        namespaceURI: ''
      },
      propertiesOrder: ['backupOptions']
    },
    CheckWindowsServices: {
      required: ['shouldExist'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckWindowsServices',
          properties: {
            target: {
              title: 'target',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Target',
                namespaceURI: ''
              }
            },
            serviceName: {
              title: 'serviceName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ServiceName',
                namespaceURI: ''
              }
            },
            state: {
              title: 'state',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'State',
                namespaceURI: ''
              }
            },
            shouldExist: {
              title: 'shouldExist',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ShouldExist',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckWindowsServices',
        namespaceURI: ''
      },
      propertiesOrder: ['target', 'serviceName', 'state', 'shouldExist']
    },
    SetVaultStatus: {
      required: ['replMode'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'SetVaultStatus',
          properties: {
            vault: {
              title: 'vault',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Vault',
                namespaceURI: ''
              }
            },
            replMode: {
              title: 'replMode',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/int'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ReplMode',
                namespaceURI: ''
              }
            },
            customer: {
              title: 'customer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Customer',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'SetVaultStatus',
        namespaceURI: ''
      },
      propertiesOrder: ['vault', 'replMode', 'customer']
    },
    WaitForProcessCompletion: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'WaitForProcessCompletion',
          properties: {
            agent: {
              title: 'agent',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Agent',
                namespaceURI: ''
              }
            },
            jobName: {
              title: 'jobName',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'JobName',
                namespaceURI: ''
              }
            },
            timeOut: {
              title: 'timeOut',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'TimeOut',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'WaitForProcessCompletion',
        namespaceURI: ''
      },
      propertiesOrder: ['agent', 'jobName', 'timeOut']
    },
    MachinePath: {
      type: 'object',
      title: 'MachinePath',
      properties: {
        machine: {
          title: 'machine',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Machine',
            namespaceURI: ''
          }
        },
        path: {
          title: 'path',
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
            }
          ],
          propertyType: 'attribute',
          attributeName: {
            localPart: 'Path',
            namespaceURI: ''
          }
        }
      },
      typeType: 'classInfo',
      typeName: {
        localPart: 'MachinePath',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'path']
    },
    'Test.Variables': {
      type: 'object',
      title: 'Test.Variables',
      required: ['any'],
      properties: {
        any: {
          title: 'any',
          allOf: [
            {
              type: 'object',
              properties: {
                name: {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
                },
                value: {}
              }
            }
          ],
          propertyType: 'anyElement'
        }
      },
      typeType: 'classInfo',
      propertiesOrder: ['any']
    },
    GetDate: {
      required: ['whichDate', 'dstOffsetEnable'],
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'GetDate',
          properties: {
            machine: {
              title: 'machine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Machine',
                namespaceURI: ''
              }
            },
            whichDate: {
              title: 'whichDate',
              allOf: [
                {
                  $ref: '#/definitions/DateType'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'WhichDate',
                namespaceURI: ''
              }
            },
            filePath: {
              title: 'filePath',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'FilePath',
                namespaceURI: ''
              }
            },
            format: {
              title: 'format',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Format',
                namespaceURI: ''
              }
            },
            dstOffsetEnable: {
              title: 'dstOffsetEnable',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/boolean'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DstOffsetEnable',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'GetDate',
        namespaceURI: ''
      },
      propertiesOrder: ['machine', 'whichDate', 'filePath', 'format', 'dstOffsetEnable']
    },
    CheckVMProperty: {
      allOf: [
        {
          $ref: '#/definitions/BaseCommand'
        },
        {
          type: 'object',
          title: 'CheckVMProperty',
          properties: {
            remoteMachine: {
              title: 'remoteMachine',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'RemoteMachine',
                namespaceURI: ''
              }
            },
            vSphereServer: {
              title: 'vSphereServer',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'vSphereServer',
                namespaceURI: ''
              }
            },
            property: {
              title: 'property',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'Property',
                namespaceURI: ''
              }
            },
            expectedValue: {
              title: 'expectedValue',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'ExpectedValue',
                namespaceURI: ''
              }
            },
            diskNo: {
              title: 'diskNo',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'DiskNo',
                namespaceURI: ''
              }
            },
            hasRestoredSuffix: {
              title: 'hasRestoredSuffix',
              allOf: [
                {
                  $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
                }
              ],
              propertyType: 'attribute',
              attributeName: {
                localPart: 'HasRestoredSuffix',
                namespaceURI: ''
              }
            }
          }
        }
      ],
      typeType: 'classInfo',
      typeName: {
        localPart: 'CheckVMProperty',
        namespaceURI: ''
      },
      propertiesOrder: ['remoteMachine', 'vSphereServer', 'property', 'expectedValue', 'diskNo', 'hasRestoredSuffix']
    },
    InterfaceType: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['VMwareServer', 'VirtualServer', 'VMwareInfrastructure', 'HyperV']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'InterfaceType',
        namespaceURI: ''
      }
    },
    Actions: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['Initialize', 'Start', 'Stop', 'Restart', 'IsRunning']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'Actions',
        namespaceURI: ''
      }
    },
    CmdletType: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: [
            'AllowForRestore',
            'Dismount',
            'GetInfo',
            'Mount',
            'MoveActiveDB',
            'PrepareForRestore',
            'RemoveMailboxDB',
            'RemoveMailboxDBCopy',
            'ResumeDBCopy',
            'SuspendDBCopy',
            'CheckDBCopyStatus',
            'UpdateDBCopy',
            'DisallowRestore',
            'EnableFailover',
            'DisableFailover',
            'Undefined'
          ]
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'CmdletType',
        namespaceURI: ''
      }
    },
    VaultOperation: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['CheckCRC', 'RepaitCRC', 'MigrateOnline', 'Dedup', 'Undefined']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'VaultOperation',
        namespaceURI: ''
      }
    },
    ActionType: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: [
            'Initialize',
            'PowerOn',
            'PowerOff',
            'IsOff',
            'Suspend',
            'TakeSnapshot',
            'HasSnapshot',
            'RevertToSnapshot',
            'RemoveSnapshot',
            'Remove',
            'UnregisterVM',
            'Deploy',
            'ConvertToTemplate',
            'ConvertToVM'
          ]
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'ActionType',
        namespaceURI: ''
      }
    },
    DBContentIndexState: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['Healthy', 'Unknown', 'Crawling', 'Failed', 'Corrupt', 'Suspended', 'Undefined']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'DBContentIndexState',
        namespaceURI: ''
      }
    },
    OperatingSystems: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: [
            'Undefined',
            'Windows2000',
            'WindowsXP',
            'WindowsXP_64',
            'Windows2003',
            'Windows2003_64',
            'WindowsVista',
            'WindowsVista_64',
            'Windows2008',
            'Windows2008_64',
            'Windows7',
            'Windows7_64',
            'Windows8',
            'Windows8_64',
            'Windows10',
            'Windows10_64',
            'Windows2011_64',
            'Windows2012_64',
            'Windows2016_64',
            'CentOS',
            'LinuxRedHat',
            'LinuxSuse',
            'Ubuntu',
            'Debian',
            'Oracle',
            'CentOS_64',
            'LinuxRedHat_64',
            'LinuxSuse_64',
            'Ubuntu_64',
            'Debian_64',
            'Oracle_64',
            'VMwareESX',
            'VMwarevSphere',
            'AIX',
            'HPUX',
            'Solaris',
            'NetWare',
            'iSeries'
          ]
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'OperatingSystems',
        namespaceURI: ''
      }
    },
    DBCopyStatus: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: [
            'Mounted',
            'Healthy',
            'Dismounted',
            'Unknown',
            'Suspended',
            'DisconnectedAndHealthy',
            'DisconnectedAndResynchronizing',
            'Failed',
            'FailedAndSuspended',
            'ServiceDown',
            'Undefined'
          ]
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'DBCopyStatus',
        namespaceURI: ''
      }
    },
    HashLoggerTypes: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['Ntfs', 'Sps2003', 'Moss2007', 'Mapi2010']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'HashLoggerTypes',
        namespaceURI: ''
      }
    },
    Severity: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['Quiet', 'Failure', 'Error', 'Warning', 'Information', 'Debug', 'Undefined']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'Severity',
        namespaceURI: ''
      }
    },
    DataSourceType: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: [
            'UNDEFINED',
            'LOCAL_FILE',
            'UNC_FILE',
            'NFS_FILE',
            'SYSTEM_STATE',
            'RSM',
            'EVENT_LOGS',
            'TERMINAL_SERVICES',
            'EXCH',
            'EXCHMAPI',
            'SQL_SERVER',
            'ORACLE',
            'ORACLE_RMAN',
            'VAULT',
            'VMWARE',
            'SHAREPOINT',
            'BMR',
            'EXCHANGE_VSS',
            'DPM',
            'EXCHANGE_2010',
            'VSPHERE',
            'SQL_2012',
            'VOLUMEIMAGE',
            'HYPERV',
            'VOLUMEIMAGE_SQL_VOLUMES',
            'VDA',
            'MAP_FILE',
            'VMWARE_DATASTORE',
            'VSPHERE_VM_FOLDERS',
            'VSPHERE_RESOURCE_POOLS',
            'ALL',
            'ALTERNATE_SAFESET_LOCATION'
          ]
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'DataSourceType',
        namespaceURI: ''
      }
    },
    RootFolderType: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['ArchiveFolder', 'MailboxFolder', 'PublicFolder']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'RootFolderType',
        namespaceURI: ''
      }
    },
    ConversionTypes: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['DOS2Unix', 'Unix2DOS']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'ConversionTypes',
        namespaceURI: ''
      }
    },
    MachineTypes: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['Physical', 'Virtual', 'DynamicallyCreated']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'MachineTypes',
        namespaceURI: ''
      }
    },
    ExchangeServerVersions: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['E2007', 'E2010']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'ExchangeServerVersions',
        namespaceURI: ''
      }
    },
    VerifyStateActions: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['VSS']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'VerifyStateActions',
        namespaceURI: ''
      }
    },
    CredentialConsumer: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: [
            'UNDEFINED',
            'LOCAL_SYSTEM',
            'SQL_SERVER',
            'ORACLE',
            'NETWORK_SHARE',
            'VMWARE',
            'VMWARE_VCENTER',
            'SMTP',
            'SHAREPOINT',
            'VSPHERE',
            'UNSET'
          ]
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'CredentialConsumer',
        namespaceURI: ''
      }
    },
    EWSDeleteType: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['EmptyFolder', 'DeleteFolder', 'DeleteFolderItems', 'Undefined']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'EWSDeleteType',
        namespaceURI: ''
      }
    },
    LanguageCode: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['English', 'French', 'German', 'Portuguese', 'Spanish']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'LanguageCode',
        namespaceURI: ''
      }
    },
    PatternTypes: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['Regex', 'String', 'LogFile']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'PatternTypes',
        namespaceURI: ''
      }
    },
    Modes: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['AMP', 'NoAMP']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'Modes',
        namespaceURI: ''
      }
    },
    DateType: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['MachineDate', 'CreationDate', 'ModifiedDate']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'DateType',
        namespaceURI: ''
      }
    },
    VRADeploymentOldMachineHandling: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['Delete', 'Keep', 'Upgrade']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'VRADeploymentOldMachineHandling',
        namespaceURI: ''
      }
    },
    TeamActionType: {
      allOf: [
        {
          $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/string'
        },
        {
          enum: ['Initialize', 'Suspend', 'PowerOff']
        }
      ],
      typeType: 'enumInfo',
      typeName: {
        localPart: 'TeamActionType',
        namespaceURI: ''
      }
    }
  },
  anyOf: [
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Restore']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Restore'
        }
      },
      elementName: {
        localPart: 'Restore',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['SuiteVariable']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/SuiteVariable'
        }
      },
      elementName: {
        localPart: 'SuiteVariable',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['RunCommand']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/RunCommand'
        }
      },
      elementName: {
        localPart: 'RunCommand',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['ChangeFile']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/ChangeFile'
        }
      },
      elementName: {
        localPart: 'ChangeFile',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['RecordResultToTestlink']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/RecordResultToTestlink'
        }
      },
      elementName: {
        localPart: 'RecordResultToTestlink',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Machine']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Machine'
        }
      },
      elementName: {
        localPart: 'Machine',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['UnixPathManipulator']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/UnixPathManipulator'
        }
      },
      elementName: {
        localPart: 'UnixPathManipulator',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Mount']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Mount'
        }
      },
      elementName: {
        localPart: 'Mount',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['SuiteTest']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/SuiteTest'
        }
      },
      elementName: {
        localPart: 'SuiteTest',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['CommandList']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/CommandList'
        }
      },
      elementName: {
        localPart: 'CommandList',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['ScrapeLog']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/ScrapeLog'
        }
      },
      elementName: {
        localPart: 'ScrapeLog',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Suite']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Suite'
        }
      },
      elementName: {
        localPart: 'Suite',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['DebugNext']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/DebugNext'
        }
      },
      elementName: {
        localPart: 'DebugNext',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['CompareFileVersion']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/CompareFileVersion'
        }
      },
      elementName: {
        localPart: 'CompareFileVersion',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['CompareFile']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/CompareFile'
        }
      },
      elementName: {
        localPart: 'CompareFile',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Test']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Test'
        }
      },
      elementName: {
        localPart: 'Test',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['VM']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/VM'
        }
      },
      elementName: {
        localPart: 'VM',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['VariableList']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/VariableList'
        }
      },
      elementName: {
        localPart: 'VariableList',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['BaseCommand']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/BaseCommand'
        }
      },
      elementName: {
        localPart: 'BaseCommand',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['MasterConfig']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/MasterConfig'
        }
      },
      elementName: {
        localPart: 'MasterConfig',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Credential']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Credential'
        }
      },
      elementName: {
        localPart: 'Credential',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['CountSafesetsOnVault']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/CountSafesetsOnVault'
        }
      },
      elementName: {
        localPart: 'CountSafesetsOnVault',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['RegisterEnvironment']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/RegisterEnvironment'
        }
      },
      elementName: {
        localPart: 'RegisterEnvironment',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['FilePair']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/FilePair'
        }
      },
      elementName: {
        localPart: 'FilePair',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['GetFileVersion']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/GetFileVersion'
        }
      },
      elementName: {
        localPart: 'GetFileVersion',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['SleepCondition']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/SleepCondition'
        }
      },
      elementName: {
        localPart: 'SleepCondition',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['OutVar']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/OutVar'
        }
      },
      elementName: {
        localPart: 'OutVar',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['ProcessedLog']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/ProcessedLog'
        }
      },
      elementName: {
        localPart: 'ProcessedLog',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Variable']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Variable'
        }
      },
      elementName: {
        localPart: 'Variable',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['ManageAgentRetentions']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/ManageAgentRetentions'
        }
      },
      elementName: {
        localPart: 'ManageAgentRetentions',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['WinPathManipulator']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/WinPathManipulator'
        }
      },
      elementName: {
        localPart: 'WinPathManipulator',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Plan']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Plan'
        }
      },
      elementName: {
        localPart: 'Plan',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Sync']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Sync'
        }
      },
      elementName: {
        localPart: 'Sync',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['ExpectedLogMatches']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/ExpectedLogMatches'
        }
      },
      elementName: {
        localPart: 'ExpectedLogMatches',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['MachinePath']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/MachinePath'
        }
      },
      elementName: {
        localPart: 'MachinePath',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['Backup']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/Backup'
        }
      },
      elementName: {
        localPart: 'Backup',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['PathManipulator']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/PathManipulator'
        }
      },
      elementName: {
        localPart: 'PathManipulator',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['AgentInfo']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/AgentInfo'
        }
      },
      elementName: {
        localPart: 'AgentInfo',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['StopActiveProcesses']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/StopActiveProcesses'
        }
      },
      elementName: {
        localPart: 'StopActiveProcesses',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['CountSafesetsOnAgent']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/CountSafesetsOnAgent'
        }
      },
      elementName: {
        localPart: 'CountSafesetsOnAgent',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['ScraperConfig']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/ScraperConfig'
        }
      },
      elementName: {
        localPart: 'ScraperConfig',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['WaitForProcessCompletion']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/WaitForProcessCompletion'
        }
      },
      elementName: {
        localPart: 'WaitForProcessCompletion',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['LogMatch']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/LogMatch'
        }
      },
      elementName: {
        localPart: 'LogMatch',
        namespaceURI: ''
      }
    },
    {
      type: 'object',
      properties: {
        name: {
          allOf: [
            {
              $ref: 'http://www.jsonix.org/jsonschemas/w3c/2001/XMLSchema.jsonschema#/definitions/QName'
            },
            {
              type: 'object',
              properties: {
                localPart: {
                  enum: ['VaultInfo']
                },
                namespaceURI: {
                  enum: ['']
                }
              }
            }
          ]
        },
        value: {
          $ref: '#/definitions/VaultInfo'
        }
      },
      elementName: {
        localPart: 'VaultInfo',
        namespaceURI: ''
      }
    }
  ]
}
