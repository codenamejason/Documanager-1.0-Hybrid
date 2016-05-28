'use strict';

app.contactsView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_contactsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
(function () {
    app.contactsView.set('title', 'Contact Us');
    
    var empdataSource = new kendo.data.DataSource({
        data: [{ id: 1, name: 'Jason Romero', email: 'codenamejason@outlook.com', phone: '727-260-0629' }, { id: 2, name: 'Jennifer Teverini', email: 'jplylldy@outlook.com', phone: '727-512-0155' }]
    });
  	// Set data source for Contact Us page
    app.contactsView.set('dataSource', empdataSource);
    // Set the alert for the Contact Us View
    app.contactsView.set('alert', function (e) { alert(e.data.name + ' ' + e.data.email + ' ' + e.data.phone); });
})();
// END_CUSTOM_CODE_contactsView