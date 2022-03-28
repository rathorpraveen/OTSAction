const core = require('@actions/core');
const github = require('@actions/github');
const urlencode = require("urlencode");
const path = require("path");
const url = require("url");
const axios = require("axios");

var datasetSrcId;
var datasetReplaceId;
var secretsCollectionId;
const Status = {
  COMPLETE: 'COMPLETE',
  COMPLETE_WITH_ERROR: 'COMPLETE_WITH_ERROR',
  STOPPED_BY_USER: 'STOPPED_BY_USER',
  STOPPED_AUTOMATICALLY: 'STOPPED_AUTOMATICALLY',
  INCOMPLETE: 'INCOMPLETE',
  RUNNING: 'RUNNING',
  IN_TRANSITION: 'IN_TRANSITION',
  SCHEDULED: 'SCHEDULED',
  CANCELED: 'CANCELED',
  LAUNCH_FAILED: 'LAUNCH_FAILED',
  STOPPING: 'STOPPING'
};

const serverStore = {
    serverUrl     :'',
    offlineToken  :'',
    accessToken   :'',

    set serverUrl(serverUrl)
    {
      this.serverUrl = serverUrl;
    },
    get getServerUrl()
    {
      return this.serverUrl;
    },

    set offlineToken(offlineToken)
    {
      this.offlineToken = offlineToken;
    },
    get getOfflineToken()
    {
      return this.offlineToken;
    },

    set accessToken(accessToken)
    {
      this.accessToken = accessToken;
    },
    get getAccessToken()
    {
      return this.accessToken;
    }
};
const asset = {
    teamspace         :'',
    project           :'',
    repository        :'',
    branch            :'',
    filepath          :'',
    environment       :'',
    variables         :'',
    datasets          :'',
    tags              :'',
    secretsCollection :'',
    startDate         :'',
    projectId         :'',
    teamspaceId       :'',
    repoId            :'',
    assetId           :'',
    externalType      :'',
    assetName         :'',
    desktopProjectId  :'',
    executionId       :'',
    resultId          :'',
    execStatus        :'',
    verdictSet        :'',
    secretId          :'',
    
    set teamspace(teamspace)
    {
      this.teamspace = teamspace;
    },
    get getTeamspace()
    {
      return this.teamspace;
    },

    set project(project)
    {
      this.project = project;
    },
    get getProject()
    {
      return this.project;
    },

    set repository(repository)
    {
      this.repository = repository;
    },
    get getRepository()
    {
      return this.repository;
    },

    set branch(branch)
    {
      this.branch = branch;
    },
    get getBranch()
    {
      return this.branch;
    },

    set filepath(filepath)
    {
      this.filepath = filepath;
    },
    get getFilePath()
    {
      return this.filepath;
    },

    set environment(environment)
    {
      this.environment = environment;
    },
    get getEnvironment()
    {
      return this.environment;
    },

    set projectId(projectId)
    {
      this.projectId = projectId;
    },
    get getProjectId()
    {
      return this.projectId;
    },

    set teamspaceId(teamspaceId)
    {
      this.teamspaceId = teamSpaceId;
    },
    get getTeamSpaceId()
    {
      return this.teamspaceId;
    },

    set repoId(repoId)
    {
      this.repoId = repoId;
    },
    get getRepoId()
    {
      return this.repoId;
    },

    set assetId(assetId)
    {
      this.assetId = assetId;
    },
    get getAssetId()
    {
      return this.assetId;
    },

    set externalType(externalType)
    {
      this.externalType = externalType;
    },
    get getExternalType()
    {
      return this.externalType;
    },

    set assetName(assetName)
    {
      this.assetName = assetName;
    },
    get getAssetName()
    {
      return this.assetName;
    },

    set desktopProjectId(desktopProjectId)
    {
      this.desktopProjectId = desktopProjectId;
    },
    get getDesktopProjectId()
    {
      return this.desktopProjectId;
    },
    
    set executionId(executionId)
    {
      this.executionId = executionId;
    },
    get getExecutionId()
    {
      return this.executionId;
    },

    set resultId(resultId)
    {
      this.resultId = resultId;
    },
    get getResultId()
    {
      return this.resultId;
    },

    set execStatus(execStatus)
    {
      this.execStatus = execStatus;
    },
    get getExecStatus()
    {
      return this.execStatus;
    },

    set verdictSet(verdictSet)
    {
      this.verdictSet = verdictSet;
    },
    get getVerdictSet()
    {
      return this.verdictSet;
    },

    set secretId(secretId)
    {
      this.secretId = secretId;
    },
    get getSecretId()
    {
      return this.secretId;
    },

    set variables(variables)
    {
      this.variables = variables;
    },
    get getVariables()
    {
      return this.variables;
    },

    set datasets(datasets)
    {
      this.datasets = datasets;
    },
    get getDatasets()
    {
      return this.datasets;
    },

    set tags(tags)
    {
      this.tags = tags;
    },
    get getTags()
    {
      return this.tags;
    },

    set secretsCollection(secretsCollection)
    {
      this.secretsCollection = secretsCollection;
    },
    get getSecretsCollection()
    {
      return this.secretsCollection;
    },

    set startDate(startDate)
    {
      this.startDate = startDate;
    },
    get getStartDate()
    {
      return this.startDate;
    }
};



const main = async () => {
  try {
    /**
     * We need to fetch all the inputs that were provided to our action
     * and store them in variables for us to use.
     **/
    const serverUrl         = core.getInput('serverUrl',{required: true});
    serverStore.serverUrl = serverUrl;
    const offlineToken      = core.getInput('offlineToken',{required: true});
    serverStore.offlineToken = offlineToken;
    const teamspace         = core.getInput('teamspace',{required: true});
    asset.teamspace = teamspace;
    const project           = core.getInput('project',{required: true});
    asset.project = project;
    const branch            = core.getInput('branch',{required: true});
    asset.branch = branch;
    const repository        = core.getInput('repository',{required: true});
    asset.repository = repository;
    const filepath          = core.getInput('filepath',{required: true});
    asset.filepath = filepath;
    const variables         = core.getInput('variables',{required: false});
    asset.variables = variables;
    const datasets          = core.getInput('datasets',{required: false});
    asset.datasets = datasets;
    const tags              = core.getInput('tags',{required: false});
    asset.tags = tags;
    const secretsCollection = core.getInput('secretsCollection',{required: false});
    asset.secretsCollection = secretsCollection;
    const startDate         = core.getInput('startDate',{required: false});
    asset.startDate = startDate;

    await serverSSLCheck(serverStore);

    await teamspaceIdGenByName(serverStore, asset);

    await projectIdGenByName(serverStore, asset);

    await repoIdGenByName(serverStore, asset);

    await branchValidation(serverStore, asset);

    await AssetIdGenByName(serverStore, asset);

    if (
        asset.getExternalType() == "APISUITE" ||
        asset.getExternalType() == "APITEST" ||
        asset.getExternalType() == "APISTUB"
      ) 
    {
      await validateEnvironment(serverStore, asset);
    }
    await startJobExecution(serverStore, asset);

    if (
      exeStatus != Status.COMPLETE ||
      exeStatus != Status.COMPLETE_WITH_ERROR ||
      exeStatus != Status.STOPPED_BY_USER ||
      exeStatus != Status.STOPPED_AUTOMATICALLY ||
      exeStatus != Status.INCOMPLETE ||
      exeStatus != Status.CANCELED ||
      exeStatus != Status.LAUNCH_FAILED
    )
    {

      await pollJobStatus(serverStore, asset);
    }

     await getResults(serverStore, asset);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function validateEnvironment(serverStore, asset) {
  if (asset.getEnvironment == "" || asset.getEnvironment == null || asset.getEnvironment == undefined) {
    throw new Error(
      "Test Environment is mandatory to run API test. Please input the value in the API Test Environment field in the task."
    );
  }
  
  var encodedBranchName = urlencode(asset.getBranch);

  var envListURL =
    serverStore.getServerUrl +
    "rest/projects/" +
    asset.getProjectId +
    "/assets/?assetTypes=environment&revision=" +
    encodedBranchName +
    "&desktopProjectId=" +
    asset.getDesktopProjectId;

  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  return axios
    .get(envListURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of environments list. " +
            envListURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var total = parsedJSON.totalElements;
      var RetrievedEnvName;
      var gotEnv = false;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          RetrievedEnvName = parsedJSON.content[i].name;
          if (asset.getEnvironment == RetrievedEnvName) {
            gotEnv = true;
            return true;
          }
        }
        if (gotEnv == false) {
          throw new Error(
            "The test environment " +
              asset.getEnvironment +
              " is not valid for the test. Please check the API Test Environment field in the task."
          );
        }
      } else {
        throw new Error(
          "Test Environments unavailable for the test execution."
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing environments list URL - " +
          envListURL +
          ". Error: " +
          error
      );
    });
}

async function getResults(serverStore, asset) {
  var resultsURL =
  serverStore.getServerUrl +
    "rest/projects/" +
    projectId +
    "/results/" +
    resultId;

  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  return axios
    .get(resultsURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of results. " +
            resultsURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var verdict = parsedJSON.verdict;
      console.log("");
      console.log("Test Result = " + verdict);
      if (verdict == "ERROR" || verdict == "FAIL") {
        
        var message = parsedJSON.message;
        console.log("");
        console.log("Error Message = " + message);
      } else {
        
      }
      console.log("@@");
      if (
        exeStatus != 'CANCELED' &&
        exeStatus != 'LAUNCH_FAILED'
      ) {
        var total = parsedJSON.reports.length;

        if (total > 0) {
          console.log("Reports information:");
          for (var i = 0; i < total; i++) {
            let reportName = parsedJSON.reports[i].name;
            let reporthref = parsedJSON.reports[i].href;
            console.log(
              reportName +
                " : " +
                url.resolve(serverUrl, reporthref)
            );
          }
        } else {
          console.log("Reports unavailable.");
        }
      }
      return true;
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing results URL - " + resultsURL + ". Error: " + error
      );
    });
}


async function getJobStatus(serverStore, asset) {
  var jobStatusURL =
  serverStore.getServerUrl +
    "rest/projects/" +
    asset.getProjectId +
    "/executions/" +
    asset.getExecutionId;

  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  var status;
  return axios
    .get(jobStatusURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of test execution status. " +
            jobStatusURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      status = parsedJSON.status;
      
      if (asset.getExecStatus != status) {
        asset.exeStatus = status;
        console.log(
          " Test Execution Status: " + asset.getExecStatus
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing test execution status URL - " +
          jobStatusURL +
          ". Error: " +
          error
      );
    });
}

async function pollJobStatus(serverStore, asset) {
  return new Promise((resolve, reject) => {
    var timerId = setInterval(async function () {
      try {
        await getJobStatus(serverStore, asset);
	      
        if (
          exeStatus == Status.COMPLETE ||
          exeStatus == Status.COMPLETE_WITH_ERROR ||
          exeStatus == Status.STOPPED_BY_USER ||
          exeStatus == Status.STOPPED_AUTOMATICALLY ||
          exeStatus == Status.INCOMPLETE ||
          exeStatus == Status.CANCELED ||
          exeStatus == Status.LAUNCH_FAILED
        ){
          // stop polling on end state
          clearInterval(timerId);
          resolve(true);
        }
        // continue polling...
      } catch (error) {
        // stop polling on any error
        clearInterval(timerId);
        reject(error);
      }
    }, 11000);
  });
}


async function startJobExecution(serverStore, asset) {
  let jobExecURL =
  serverStore.getServerUrl +
    "rest/projects/" +
    asset.getProjectId +
    "/executions/";
  var AssetParameters = {
    testAsset: {
      assetId: asset.getAssetId,
      revision: asset.getBranch,
    },
    offlineToken: serverStore.getOfflineToken,
  };

  if (
    asset.getExternalType() == "APISUITE" ||
    asset.getExternalType() == "APITEST" || 
	  asset.getExternalType() == "APISTUB"
    ) 
  {
    AssetParameters["environment"] = asset.getEnvironment;
  }

  if (asset.getVariables) {
    var str_array = asset.getVariables.split(';');
    var varObj = {};
	  var keyval;
	  var key;
    for (var i = 0; i < str_array.length; i++) {
      keyval = str_array[i].split('=');
      key = keyval[0];
      varObj[key] = keyval[1];
    }
    AssetParameters["variables"] = varObj;
  }

  if(asset.getStartDate)
  {
    const event = new Date(asset.getStartDate);
    var at = {at:event.toISOString()};
    AssetParameters["scheduled"] = at;
  }

  if(asset.getDatasets)
  {
    var str_array = asset.getDatasets.split(',');
    await getSrcDataSetId(serverStore,asset,str_array[0]);
    await getReplaceDataSetId(serverStore,asset,datasetSrcId,str_array[1]);
    var dataSources = [];
   
    var sources = {
      "source": {
        "assetId": datasetSrcId
      },
      "replacement": {
        "datasetId": datasetReplaceId
      }
    }
    dataSources.push(sources);
    AssetParameters["dataSources"] = dataSources;
  }

  if(tags)
  {
   var tag = tags.split(',');
   AssetParameters["tags"] = tag;    
  }

  if(secretsCollectionName)
  {
   await getSecretCollectionId(serverStore,asset);
   AssetParameters["secretsCollection"] = asset.getSecretId;    
  }
 
  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    "Content-Type": "application/json",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  var body = JSON.stringify(AssetParameters);
  console.log("request body = "+body);
  return axios
    .post(jobExecURL, body, { headers: headers })
    .then((response) => {
      if (response.status != 201) {
        throw new Error(
          "Error during launch of test. " +
            jobExecURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      asset.exeId = parsedJSON.id;
      asset.resultId = parsedJSON.result.id;
      asset.exeStatus = parsedJSON.status;
      return true;
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing test execution URL - " +
          jobExecURL +
          ". Error: " +
          error
      );
    });
}

async function AssetIdGenByName(serverStore,asset) {
  var assetName =  path.parse(asset.getFilePath).name;
  var encodedAssetName = urlencode(asset.getAssetName);
  var encodedBranchName = urlencode(asset.getBranch);
  var testsListURL =
    serverStore.getServerUrl +
    "rest/projects/" +
    asset.getProjectId +
    "/assets/?assetTypes=EXECUTABLE&name=" +
    encodedAssetName +
    "&revision=" +
    encodedBranchName +
    "&deployable=true";

  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  return axios
    .get(testsListURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of testassets. " +
            testsListURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var total = parsedJSON.totalElements;
      var retrievedPath;
      var retrievedRepoId;
      var gotId = false;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          retrievedPath = parsedJSON.content[i].path;
          retrievedRepoId = parsedJSON.content[i].repository_id;
          if (
            retrievedPath == asset.getFilePath &&
            retrievedRepoId == asset.getRepoId
          ) {
            asset.assetId = parsedJSON.content[i].id;
            asset.externalType = parsedJSON.content[i].external_type;
            asset.desktopProjectId = parsedJSON.content[i].desktop_project_id;
            gotId = true;
            return true;
          }
        }
        if (!gotId) {
          throw new Error(
            "The file path " +
              asset.getFilePath +
              " was not found in the branch " +
              asset.getBranch +
              " corresponding to the repository " +
              asset.getRepository +
              " in the project " +
              asset.getProject +
              ". Please check the File path field in the task."
          );
        }
      } else {
        throw new Error(
              "The file path " +
              asset.getFilePath +
              " was not found in the branch " +
              asset.getBranch +
              " corresponding to the repository " +
              asset.getRepository +
              " in the project " +
              asset.getProject +
              ". Please check the File path field in the task."
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing testassets API - " +
          testsListURL +
          ". Error: " +
          error
      );
    });
}



async function branchValidation(serverStore, asset) {
  let branchListURL =
  serverStore.getServerUrl +
    "rest/projects/" +
    asset.getProjectId +
    "/branches/";

  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  return axios
    .get(branchListURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of branches. " +
            branchListURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var total = parsedJSON.totalElements;
      var RetrievedBranchName;
      var gotBranch = false;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          RetrievedBranchName = parsedJSON.content[i].name;
          if (asset.getBranch == RetrievedBranchName) {
            gotBranch = true;
            return true;
          }
        }
        if (gotBranch == false) {
          throw new Error(
            "The branch " +
            asset.getBranch +
              " was not found in the project " +
              asset.getProject +
              ". Please check the Branch field in the task."
          );
        }
      } else {
        throw new Error(
          "The branch " +
          asset.getBranch +
            " was not found in the project " +
            asset.getProject +
            ". Please check the Branch field in the task."
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing branch list API - " +
          branchListURL +
          ". Error: " +
          error
      );
    });
}




async function repoIdGenByName(serverStore, asset) {
  let reposListURL =
    serverStore.getServerUrl +
    "rest/projects/" +
    asset.getAssetId +
    "/repositories/";

  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  return axios
    .get(reposListURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of repositories. " +
            reposListURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var total = parsedJSON.totalElements;
      let retrievedRepoName;
      let gotId = false;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          retrievedRepoName = parsedJSON.content[i].uri;
          if (asset.getRepository == retrievedRepoName) {
            asset.repoId = parsedJSON.content[i].id;
            gotId = true;
            return true;
          }
        }
        if (!gotId) {
          throw new Error(
            "The repository " +
            asset.getRepository +
              " was not found in the project " +
              asset.getProject +
              " Please check the Repository field in the task."
          );
        }
      } else {
        throw new Error(
          "The repository " +
          asset.getRepository +
            " was not found in the project " +
            asset.getProject +
            " Please check the Repository field in the task."
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing repository list API - " +
          reposListURL +
          ". Error: " +
          error
      );
    });
}

async function projectIdGenByName(serverStore, asset) {
  let encodedProjName = urlencode(asset.getProject);
  let projectsListURL =
    serverStore.getServerUrl +
    "rest/projects?archived=false&member=true&name=" +
    encodedProjName;

  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
    spaceId: asset.getTeamSpaceId,
  };
  return axios
    .get(projectsListURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of projects. " +
            projectsListURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var total = parsedJSON.total;
      var retrievedProjName;
      var gotId = false;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          retrievedProjName = parsedJSON.data[i].name;
          if (asset.getProject == retrievedProjName) {
            asset.projectId = parsedJSON.data[i].id;
            gotId = true;
            return true;
          }
        }
        if (!gotId) {
          throw new Error(
            "You do not have access to the project " +
              project +
              " or the project was not found in the teamspace " +
              teamspace +
              " in the server. Please check the Project field in the task."
          );
        }
      } else {
        throw new Error(
          "You do not have access to the project " +
            project +
            " or the project was not found in the teamspace " +
            teamspace +
            " in the server. Please check the Project field in the task."
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing projects list API - " +
          projectsListURL +
          ". Error: " +
          error
      );
    });
}
function serverSSLCheck(serverStore) {
  var sslCheckUrl = serverStore.getServerUrl;
  return axios
    .get(sslCheckUrl)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      if (error.code == "ENOTFOUND") {
        throw new Error(
          "Cannot resolve the host. Please check the server URL and connectivity to the server."
        );
      } else if (error.code == "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
        throw new Error(
          "Could not establish secure connection to the server " +
          serverUrl +
            ". Please validate the SSL certificate of the server or import the CA certificate of the server to your trust store. Error: " +
            error.message
        );
      } else if (error.code == "CERT_HAS_EXPIRED") {
        throw new Error(
          "Could not establish secure connection to the server " +
          serverUrl +
            ". The server presented an expired SSL certificate. Error: " +
            error.message
        );
      } else {
        throw new Error(
          "Could not establish secure connection to the server " +
          serverUrl +
            ". Error: " +
            error.message
        );
      }
    });
}

function accessTokenGen(serverStore) {
  var tokenURL = serverStore.getServerUrl + "rest/tokens/";
  var body = "refresh_token=" + serverStore.getOfflineToken;
  var headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return axios
    .post(tokenURL, body, {
      headers: headers,
    })
    .then((response) => {
      if (
        response.status == 400 ||
        response.status == 401 ||
        response.status == 402
      ) {
        throw new Error(
          "Error during retrieval of access token. Please check the offline token in the service connection. Request returned response code: " +
            response.status
        );
      }
      if (response.status == 403) {
        throw new Error(
          "Error during retrieval of access token. Please check the license as request is unauthorized. Request returned response code: " +
            response.status
        );
      }
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of access token. Request returned response code: " +
            response.status
        );
      }
      serverStore.accessToken = response.data.access_token;
      return response.data;
    })
    .catch((error) => {
      if (error.code == "ENOTFOUND") {
        throw new Error(
          "Cannot resolve the host. Please check the server URL and connectivity to the server."
        );
      } else if (error.code == "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
        throw new Error(
          "Could not establish secure connection to the server " +
            serverStore.getServerUrl +
            ". Please validate the SSL certificate of the server or import the CA certificate of the server to your trust store. Error: " +
            error.message
        );
      } else if (error.code == "CERT_HAS_EXPIRED") {
        throw new Error(
          "Could not establish secure connection to the server " +
          serverStore.getServerUrl +
          +
            ". The server presented an expired SSL certificate. Error: " +
            error.message
        );
      } else {
        throw new Error(
          "Error when accessing Token management URL: " +
            tokenURL +
            " Error: " +
            error
        );
      }
    });
}

async function teamspaceIdGenByName(serverStore, asset) {
  let encodedTeamspaceName = urlencode(asset.getTeamspace);
  let teamspacesListURL =
    serverStore.getServerUrl +
    "rest/spaces?search=" +
    encodedTeamspaceName +
    "&member=true";

  await accessTokenGen(serverStore);
  console.log("##########################access token is = "+accessToken);
  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + accessToken,
  };
  return axios
    .get(teamspacesListURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of teamspaces. " +
            teamspacesListURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var retrievedTeamSpaceName;
      var gotId = false;
      var total = parsedJSON.length;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          retrievedTeamSpaceName = parsedJSON[i].displayName;
          if (teamspace == retrievedTeamSpaceName) {
            asset.teamSpaceId = parsedJSON[i].id;
            gotId = true;
            return;
          }
        }
        if (!gotId) {
          throw new Error(
            "You do not have access to the team space " +
              teamspace +
              " or the team space was not found in the server. Please check the Team Space field in the task."
          );
        }
      } else {
        throw new Error(
          "You do not have access to the team space " +
          teamspace +
          +
            " or the team space was not found in the server. Please check the Team Space field in the task."
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing teamspaces list API - " +
          teamspacesListURL +
          ". Error: " +
          error
      );
    });
} 

async function getSrcDataSetId(serverStore, asset, srcDataSet) {
  let datasetURL = serverStore.getServer+"rest/projects/"+asset.getProjectId+"/assets/"+asset.getAssetId+"/"+asset.getBranch+"/dependencies/?assetTypes=dataset";
  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  return axios
    .get(datasetURL, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of Source data set ID. " +
          datasetURL +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var total = parsedJSON.totalElements;
      var retrievedDatasetName;
      var gotId = false;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          
          retrievedDatasetName = parsedJSON.content[i].path;
          if (srcDataSet == retrievedDatasetName) {
            datasetSrcId = parsedJSON.content[i].id;
            gotId = true;
            return true;
          }
        }
        if (!gotId) {
          throw new Error(
           "No Dataset configured for the Asset"
          );
        }
      } else {
        throw new Error(
          "No Dataset configured for the Asset"
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing DataSet API - " +
        datasetURL +
          ". Error: " +
          error
      );
    });
}

async function getReplaceDataSetId(serverStore, asset, srcDataSetId, repDataset) {
  let repDataUrl = serverStore.getServer+"rest/projects/"+asset.getProjectId+"/datasets/?branch="+asset.getBranch+"&assetId="+srcDataSetId+"&findSwaps=true";
  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  return axios
    .get(repDataUrl, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of Source data set ID. " +
          repDataUrl +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var total = parsedJSON.data.length;
      var retrievedDatasetName;
      var gotId = false;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          retrievedDatasetName = parsedJSON.data[i].displayPath;
          if (repDataset == retrievedDatasetName) {
            datasetReplaceId = parsedJSON.data[i].datasetId;
            gotId = true;
            return true;
          }
        }
        if (!gotId) {
          throw new Error(
           "No Swap configured for the DataSets"
          );
        }
      } else {
        throw new Error(
          "No Swap configured for the DataSets"
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing DataSet Swap API - " +
        repDataUrl +
          ". Error: " +
          error
      );
    });
}

async function getSecretCollectionId(serverStore, asset) {
  
  let secretUrl = serverStore.getServer+"rest/projects/"+asset.getProjectId+"/secrets/?type=ENVIRONMENT";
  await accessTokenGen(serverStore);

  var headers = {
    "Accept-Language": "en",
    Authorization: "Bearer " + serverStore.getAccessToken,
  };
  return axios
    .get(secretUrl, { headers: headers })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(
          "Error during retrieval of Secret Collection ID. " +
          secretUrl +
            " returned " +
            response.status +
            " response code. Response: " +
            response.data
        );
      }
      var parsedJSON = response.data;
      var total = parsedJSON.data.length;
      var retsecretCollectionName;
      var gotId = false;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          var respData = parsedJSON.data[i];
          retsecretCollectionName = respData.name;
          if (asset.getSecretsCollection == retsecretCollectionName) {
            secretsCollectionId = respData.id;
            asset.secretsCollectionId = secretsCollectionId;
            gotId = true;
            return true;
          }
        }
        if (!gotId) {
          throw new Error(
           "Secret collection does not available on server."
          );
        }
      } else {
        throw new Error(
          "No Secret configured."
        );
      }
    })
    .catch((error) => {
      throw new Error(
        "Error when accessing Secret Collection API - " +
        secretUrl +
          ". Error: " +
          error
      );
    });
}
// Call the main function to run the action
main();
