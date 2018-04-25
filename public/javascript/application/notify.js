let notify = function (self, message, data){
    switch (message_spl) {
//----------------------------------------------------------------------------------------------------------------------
        case 'app':
            switch (data_apl[0]) {
                case 'init':
                    APP.tm_o = new TemplateManager_cl();
                    break;

                default:
                    console.warn('Unbekannte app-Notification: ' + data_apl[0]);
                    break;
            }
            break;
//----------------------------------------------------------------------------------------------------------------------
        default:
            console.warn('Unbekannte Notification: ' + message_spl);
            break;
    }

}