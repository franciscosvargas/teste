module.exports.toSettingsObject = (settingsList) => {
    return settingsList.reduce((settings, item) => {
        settings[item.name] = item.value;
        return settings;
    }, {});
}

