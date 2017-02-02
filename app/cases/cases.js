app.controller("cases", ["dashboardData", "channelData","groupList", function (dashboardData, channelData, groupList) {

    var self = this;
    dashboardData.getCasesSidebar().then(function (answer) {
        self.casesInfo = answer.data;
        self.totalCases = self.casesInfo.length;
    })
    
    self.Policy = {};
    self.readonly = false;
    self.removable = true;
    self.requireMatch = true;
    
    channelData.getAllChannels().then(function (answer) {
        self.channels = answer.data
    })
    groupList.getGroups().then(function(answer){
        self.groups = answer.data
    })
    channelData.getComputerList().then(function(answer){
        self.users = answer.data
    })
    
    self.selectedChannels = [];
    self.selectedUsers = [];
    self.Policy.ChannelIds = [];
    self.Policy.UserGroupsList = [];
    self.Policy.UsersList = [];
    
    
    self.filterChannels = function () {
        for (i in self.selectedChannels) {
            var id = self.selectedChannels[i].Id
        }
        self.Policy.ChannelIds.push(id)
    }
    
    self.filterUsers = function () {
        for (i in self.selectedUsers) {
            var name = self.selectedUsers[i].name
        }
        self.Policy.UsersList.push(name)
    }

}])
