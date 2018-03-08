var medicinesDataTabs;
var newMedicinesTabs;
var global_exportFlag = false;
var medicineDataDS;
var doctorsAppDataDS;
var autoOpenMedicineTabVar = 0;
var newMedicineTabVar = 0;
var fullNameVar = '';



var fileTypesArr = new Array();
fileTypesArr.push('.doc');
fileTypesArr.push('.xls');
fileTypesArr.push('.gif');
fileTypesArr.push('.jpg');
fileTypesArr.push('.jpeg');
fileTypesArr.push('.pdf');
fileTypesArr.push('.txt');
fileTypesArr.push('.zip');
fileTypesArr.push('.xml');
fileTypesArr.push('.docx');
fileTypesArr.push('.xlsx');

var maxFileSize = 4096000;

var global_specificTabId = -1;
var imageWin = '<div id="win1"></div>';

var guid = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};
})();

var hasScrollbar = function(){
	var root = document.compatMode == 'BackCompat' ? document.body : document.documentElement;
	return (root.scrollHeight > root.clientHeight);
};

function eeasValidateFileInput(value, validator, $field) {
	var wdgt = $field.parents('.k-widget');
	if (wdgt.find('ul.k-upload-files').length > 0) {
		return true;
	}
    return false;
}


var deletedAttachedDocuments = new Array();

var isRecamalMedMode = (typeof $("#recamalMedMode").val() !== 'undefined' && $("#recamalMedMode").val() > 0) ? 1 : 0;
var isRecamalHQMode = (typeof $("#recamalHQMode").val() !== 'undefined' && $("#recamalHQMode").val() > 0) ? 1 : 0;
var recamaleExportExcelMode = (typeof $("#recamaleExportExcelMode").val() !== 'undefined' && $("#recamaleExportExcelMode").val() > 0) ? 1 : 0;
var recamaleUsageColMode = (typeof $("#recamaleUsageColMode").val() !== 'undefined' && $("#recamaleUsageColMode").val() > 0) ? 1 : 0;


autoOpenMedicineTabVar = (typeof $("#autoOpenMedicinesTab").val() !== 'undefined' && $("#autoOpenMedicinesTab").val() > 0) ? $("#autoOpenMedicinesTab").val() : 0;
newMedicineTabVar = (typeof $("#autoOpenNewMedicinesTab").val() !== 'undefined' && $("#autoOpenNewMedicinesTab").val() > 0) ? $("#autoOpenNewMedicinesTab").val() : 0;



var _globalMedicineName = "";




/* Medicines Data Grid Starts Here */
medicineDataDS = new kendo.data.DataSource({
	page: 1,
	pageSize: 10,
	serverPaging: true,
    serverSorting: true,
    //sort: getSortingPreferencesGrid(),
    serverFiltering: true,
    filterable: {
        mode: "row"
    },
    schema: {
    	data: "results",
    	total: "total",
		model: {
			id: "ID",
            fields: {   
            	ID:{ type: "number" ,editable: false},
            	MEDICINE_NAME: {type: "string",editable: true,validation: { medicinenamevalidation:  _medicinenamevalidation  }},
            	COMPOSITION: {type: "string",editable: true},
            	REIMBURSIBLE: { type: "string",editable: isRecamalHQMode === 1 ? true : false,template: "#=formTypeData.FormTypeName#" },
            	USAGE: { type: "string" ,editable: true},
            	COMMENTS: {type: "string",editable: true},
            	APP_DATE: {type: "string"},
            	LINK: {type: "string", editable: true},
            	ATTACHMENT: { type: "string" ,editable: true, template: "#=customSaveField#"},
            }
        }
    },
	transport:
	{
		read: {
			url: "/ListofPharmaceuticalProducts/GetMedicalList",
			dataType: "json",
			data: { cache: false, nocache: Math.random(), recMode: isRecamalMedMode},
			type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            }
		},
		update: {
			url: "/ListofPharmaceuticalProducts/UpdateMedicalList",
			dataType: "json",
			type: 'POST',
			data: { cache: false, nocache: Math.random(), recMode: isRecamalMedMode},
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
			},
			complete: function (e,data) { 
		                _updateMedicine(e,data);	
			     	}
		},
        create: {
			url: "/ListofPharmaceuticalProducts/CreateMedicalList",
			dataType: "json",
			type: 'POST',
            data: { cache: false, nocache: Math.random(), recMode: isRecamalMedMode},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            },
		    complete: function (e,data) {
				_addNewMedicine(e);	               
		     }
		},
		parameterMap: function(data, type) {
			if (type !== "read" && data.models) {
        		return {models: kendo.stringify(data.models)};
        	}
			return data;
		}
	}
});


/* Doctor's approval Grid Starts Here */
doctorsAppDataDS = new kendo.data.DataSource({
	page: 1,
	pageSize: 10,
	serverPaging: true,
    serverSorting: true,
    //sort: getSortingPreferencesGrid(),
    serverFiltering: true,
    sortable: true,
    schema: {
    	data: "results",
    	total: "total",
		model: {
			id: "ID",
            fields: {   
            	ID:{ type: "number" ,editable: false},
            	MEDICINE_NAME: {type: "string",editable: true,validation: { medicinenamevalidation:  _medicinenamevalidation  }},
            	COMPOSITION: {type: "string",editable: true},
            	REIMBURSIBLE: { type: "string",editable: true,template: "#=formTypeData.FormTypeName#" },
            	USAGE: { type: "string" ,editable: true},
            	COMMENTS: {type: "string",editable: true},
            	REQUESTED_BY: {type: "string",editable: false},
            	APP_DATE: {type: "string"},
            	LINK: {type: "string", editable: true},
            	ATTACHMENT: { type: "string" ,editable: true, template: "#=customSaveField#"},
            	REQUESTED_TO: {type: "string",editable: false},
            }
        }
    },
	transport:
	{
		read: {
			url: "/ListofPharmaceuticalProducts/GetMedicalListDoctor",
			dataType: "json",
			data: { cache: false, nocache: Math.random(), recMode: isRecamalHQMode},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            },
			type: 'POST'
		},
		update: {
 			url: "/ListofPharmaceuticalProducts/UpdateMedicalList",
			dataType: "json",
			type: 'POST',
            data: { cache: false, nocache: Math.random(), recMode: isRecamalHQMode},
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            },
		    complete: function (e,data) { 
	                _updateMedicine(e);
		     }
		},
		destroy: {
			url: "index.cfm",
			dataType: "json",
			type: 'POST',
			data: {
				    fuseaction: 'recamalMedicalDB.disapproveMedicineDS',
				    cache: false, nocache: Math.random(), recMode: isRecamalHQMode
			   },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            },
			complete: _disapproveMedicineDS    
		},	
		parameterMap: function(data, type) {
			if (type !== "read" && data.models) {
        		return {models: kendo.stringify(data.models)};
        	}
			return data;
		}
	}
});


$(document).ready(function(){
	
	//-------------------------------------------------------------MAIN MEDICINE DATA GRID SECTION-----------------------------
	 
	var medicineDataVar = $('#medicinesDataGrid').kendoGrid({
		dataSource: medicineDataDS,
		height: 600,
 		columns: setMedicineGridFileds(),
      	editable:  {
			mode: "popup",
			confirmation: true,
            confirmDelete: 'Yes'
		
		},
		save: function(e,c) {
			e.model.set("ATTACHMENT",$("#uploadedFile").val());
		},
		cancel: function(e) {
			
			if (!confirm(getString('Update')))
			 {	    
				 e.preventDefault();
			 }
			else
			{
				$('#medicinesDataGrid').data('kendoGrid').dataSource.read();
				$('#medicinesDataGrid').data('kendoGrid').refresh();
			}
		},
		toolbar: getMedicinesGridToolbarConfig(),
		excel: {
		    allPages: true
		},
		columnMenu: {
			columns: isRecamalHQMode ? true : false,
			filterable: false,
			sortable: true
		},
			
		sortable: {
			mode: (isRecamalMedMode == 1) ? 'single' : 'multiple'
		},
		pageable: {
			pageSize: 10,
			pageSizes: [10, 20, 50]
		},
		filterable: {
			mode: 'row'
		},
		save: _saveConfirmMsg,
		resizable: true,
	    dataBound: function(e) {
	    	var filter = this.dataSource.filter();
			
			this.thead.find(".k-button.k-button-icon").css("visibility", "hidden");
			
			 //vertical align header action text
			var gridCol = this.thead.find('[data-index="7"]')[0];
			$(gridCol).css("vertical-align", "inherit");
			 
			this.thead.find(".k-icon.k-i-close").css("visibility", "hidden");
			this.thead.find(".k-icon.k-i-close").css("visibility", "hidden");
	    	$('.k-grid-update').addClass("k-button btn-primary btn-xs no-icon btn-no-min-width btn-center-padding");
			$('.k-grid-edit').addClass("k-button btn-primary btn-xs no-icon btn-no-min-width btn-center-padding");
	    	$('.k-grid-cancel').addClass("k-button btn-default btn-xs no-icon btn-no-min-width btn-center-padding");
				    	
	    	var buttonStr = '<button type="button" onclick="resetFilter()" class="btn btn-primary btn-xs no-icon btn-no-min-width" style="padding:0px 10px; margin-top:4px;">';
	    	buttonStr += getString('Reset');
	    	buttonStr += '</button>';
	    	$('.k-filter-row th:last-child').html(buttonStr);
	    	$('.k-filter-row th:last-child').css('text-align', 'center');
	    	$('.k-filter-row input').on('keypress', function(event){
	    		if (event.keyCode == 10 || event.keyCode == 13) {
	    			event.preventDefault();
	    		}
	    	});

	    	dataView = this.dataSource.view();
            for (var i = 0; i < dataView.length; i++) {
            	 
            	 var currentUid = dataView[i].uid;
                 if (isRecamalHQMode == 0) {
                     var currenRow =  $("#medicinesDataGrid tbody").find("tr[data-uid='" + currentUid + "']");
                     var editButton = $(currenRow).find(".k-grid-edit");
                     editButton.hide();
                 }                 
            	 if((dataView[i].REIMBURSIBLE) =='') {
	               	 var uid = dataView[i].uid;
	               	 $("#medicinesDataGrid tbody").find("tr[data-uid=" + uid + "]").css("background","#FFFFFF"); 
	               }
                if ((dataView[i].REIMBURSIBLE).trim()=='REIMBURSABLE') {
                    var uid = dataView[i].uid;
                    $("#medicinesDataGrid tbody").find("tr[data-uid=" + uid + "]").css("background","#e6ffe6");  
                   }
                if((dataView[i].REIMBURSIBLE).trim()=='NON-REIMBURSABLE') {
                 	 var uid = dataView[i].uid;
                 	 $("#medicinesDataGrid tbody").find("tr[data-uid=" + uid + "]").css("background","#ffe6e6"); 
                 	}
                if((dataView[i].REIMBURSIBLE).trim()=='PAR') {
	             	 var uid = dataView[i].uid;
	             	 $("#medicinesDataGrid tbody").find("tr[data-uid=" + uid + "]").css("background","#ffffe6"); 
             	}
            }
	    },
	    columnReorder: function(e) {
	    	if (typeof e.column.reorderable != "undefined" && !e.column.reorderable) {
	            setTimeout(function() {
	                e.sender.reorderColumn(e.oldIndex, e.sender.columns[e.newIndex]);
	            }, 0);
	        }
	    }
	});

	$("#medicinesDataGrid").data("kendoGrid").bind("excelExport", function (e) {catchExportExcel(e, "excel");});
	
	function _saveConfirmMsg(e) {	
		if(e.model.ID  == 0)
		{
			
			if (!confirm(getString('Create'))) {
		    	
		        e.preventDefault();
		        }
			else{
		    	
		    	$('#medicinesDataGrid').data('kendoGrid').dataSource.read();
				$('#medicinesDataGrid').data('kendoGrid').refresh();
				if(isRecamalHQMode == 1)
					{
						$('#approvalDataGrid').data('kendoGrid').dataSource.read();
						$('#approvalDataGrid').data('kendoGrid').refresh();
					}
			
					
		}
		}
			else
				{
		
	    if (!confirm(getString('Save'))) {
	    	
	        e.preventDefault();
	        }
	    else{
	    		    	
	    	$('#medicinesDataGrid').data('kendoGrid').dataSource.read();
			$('#medicinesDataGrid').data('kendoGrid').refresh();
			if(isRecamalHQMode == 1)
				{
					$('#approvalDataGrid').data('kendoGrid').dataSource.read();
					$('#approvalDataGrid').data('kendoGrid').refresh();
				}
			toastr.success(getString('Modified Successfully'));
	    	
	    }
	 }
	}

	medicinesDataTabs = $('#medicinesDataTabs').kendoTabStrip({
		contentLoad: function(e) {
			
			$('#approvalDataGrid').data('kendoGrid').dataSource.read();
			$('#approvalDataGrid').data('kendoGrid').refresh();
			
				}
			});
	
	//Doctors approval Pannel Grid
	
	var medicineAppDataVar = $('#approvalDataGrid').kendoGrid({
		dataSource: doctorsAppDataDS,
        height: 600,
		columns: [
		          {field: 'MEDICINE_NAME', title: getString('Medicine Name'), width: "100px",editor:  medicineNameEditor ,  filterable: {
	        		  extra: false,
		        	
		        	  cell: {showOperators: false}}},
		          {field: 'COMPOSITION',  title:getString('Composition'), width: "150px", editor: textareaEditor, filterable: {
	        		  extra: false,
		        	 
		        	  cell: {showOperators: false}}},
		          {field: 'REIMBURSIBLE',hidden:true,  title:getString('Reimbursible'), width: "50px",editor: reimbursibleStatusDropDownEditor,  filterable: {
	        		  extra: false,
		        	  
		        	  cell: {showOperators: false}}},
		          {field: 'USAGE', title:getString('Usage'), width: "150px", editor: textareaEditor,editor: textareaEditor,filterable: {
	        		  extra: false,
		        	  
		        	  cell: {showOperators: false}}},
		          {field: 'COMMENTS',  title:getString('Comments') , width: "150px", editor: textareaEditor, filterable: {
	        		  extra: false,
		        	 
		        	  cell: {showOperators: false}}},
		        	  {field: 'REQUESTED_BY',  title:getString('Requested By'), width: "150px",  filterable: {
		        		  extra: false,
			        	 
			        	  cell: {showOperators: false}}},
			      {field: 'APP_DATE', title: getString('Last Updated'), format: "{0:dd/MM/yyyy}",editable: false, width: "80px",
			        		  editor: _hideFieldInEditor , 		        		  
			        		    	  filterable: {
			        		    		  extra: false,
			        		        	  cell: {
			        		                	template: function (e) {
			        		                		e.element.kendoDatePicker({
			        		                			format: "dd/MM/yyyy"
			        		                        }).data("kendoDatePicker");
			        		                	},
			        		                    showOperators: false
			        		                }
			        		    	  }
			        		      },
		          {field: 'LINK', hidden: false, width: 100, title: getString('url Link'), template: '# if(LINK) { # <a href="#= LINK #" target="_blank">Link</a> # } #', filterable: {cell: {showOperators: false}}},
		          {field: 'ATTACHMENT',  title:getString('File'), width: "80px",
		        			  editor: fileUploadEditor,
		        			  template:  function(dataItem) {
						 			var returnStr = '';
						 			if(dataItem.ATTACHMENT == 1) {
						 				returnStr += 
						 					
						 						'<span id="undo" style="height: 26px; margin: 0px 2px; min-width: 64px;" class="k-button" onclick="myFunction('+dataItem['ID']+');">View</span>'
						 			} else {
						 				returnStr += '';
						 			}
						 			return returnStr;
						 		},		
						 		  filterable: {
			                          cell: {
			                              enabled: false
			                          }
			                      },
			                      sortable: false} ,
		        	  { command: [
		        	              {name: 'edit',
                                	  template: "<a class='k-button k-grid-edit' href='' style='display: block;width: 46px;margin: 0 auto;'><span class='k-icon k-edit'></span>"+getString('Edit')+"</a>"
		                          }
		        	              /*,
		        	              {name: 'destroy', text: " ", width: '30', 
                    	  			template: "<a class='k-button k-grid-delete' href='' style='min-width:16px;'><span class='k-icon k-delete'></span></a>" ,
                                 }*/
		        	              
		        	              ],
			        	 title: getString('Action'), width: "100px" }
		          ],
		      	editable:  {
					mode: "popup",
					confirmation: getString('Delete Medicine')
				
				},
					save: function(e,c){
						e.model.set("ATTACHMENT",$("#uploadedFile").val());
					},
		
		columnMenu: {
			columns: true,
			filterable: false,
			sortable: false
		},
		sortable: {
			mode: (isRecamalHQMode == 1) ? 'single' : 'multiple'
		},
		pageable: {
			pageSize: 10,
			pageSizes: [10, 20, 50]
		},
		filterable: {
			mode: 'row'
		},
		cancel: function(e)
		{
			if (!confirm(getString('Update')))
			 {	    
				 e.preventDefault();
			 }
			else
			{
				$('#approvalDataGrid').data('kendoGrid').dataSource.read();
				$('#approvalDataGrid').data('kendoGrid').refresh();
			}
		},
		save: _saveConfirmMsg,
		resizable: true,
	    dataBound: function(e) {
	    	
	    	var grid = $("#approvalDataGrid").data("kendoGrid");
	    	// grid.hideColumn(3);
	    	$('.k-grid-update').addClass("k-button btn-primary btn-xs no-icon btn-no-min-width btn-center-padding");
			$('.k-grid-edit').addClass("k-button btn-primary btn-xs no-icon btn-no-min-width btn-center-padding");
	    	$('.k-grid-cancel').addClass("k-button btn-default btn-xs no-icon btn-no-min-width btn-center-padding");
			
			 var filter = this.dataSource.filter();
				
			 this.thead.find(".k-button.k-button-icon").css("visibility", "hidden");
			 
			 this.thead.find(".k-icon.k-i-close").css("visibility", "hidden");
	    	
	    	var buttonStr = '<button type="button" onclick="resetFilter1()" class="btn btn-primary btn-xs no-icon btn-no-min-width" style="padding:0px 10px; margin-top:4px;">';
	    	buttonStr += getString('Reset');
	    	buttonStr += '</button>';
	    	$('.k-filter-row th:last-child').html(buttonStr);
	    	$('.k-filter-row th:last-child').css('text-align', 'center');
	    	$('.k-filter-row input').on('keypress', function(event){
	    		if (event.keyCode == 10 || event.keyCode == 13) {
	    			event.preventDefault();
	    		}
	    	});	    	
	    	 dataView = this.dataSource.view();
	    },
	    columnReorder: function(e) {
	    	if (typeof e.column.reorderable != "undefined" && !e.column.reorderable) {
	            setTimeout(function() {
	                e.sender.reorderColumn(e.oldIndex, e.sender.columns[e.newIndex]);
	            }, 0);
	        }
	    }
	});	
	
});



function myFunction(e) {
	
    $('#undo').html(imageWin);
    $("#win1").html('<img src="index.cfm?fuseaction=recamalMedicalDB.medicineImage&id='+ e +'&nocache='+Math.random()+'"/>');
   
    $("#win1").show().kendoWindow({
        width: "600px", 
        height: "600px",
        modal: true,
        title: "Image",
        actions: [
                  "Minimize",
                  "Maximize",
                  "Close"
              ],
    }).data("kendoWindow").center().open();
	$('#undo').text('View');
    $("#win1").data("kendoWindow").refresh();
	$('#undo').text('View');
     
};

function onSuccess(e){ 
    $("#uploadedFile").val(e.files[0].name);
};

function onClose() {
    $('<span id="undo" style="display:none" class="k-button hide-on-narrow">Click here to open the </span>').fadeIn();
};

function fileUploadEditor(container, options) {
	if(options.model.ID)
		{
		$('<input name="ATTACHMENT" id="ATTACHMENT" data-role="upload" type="file" accept=".jpg, .png, .jpeg, .bmp|images/*"/>')
	    .appendTo(container)
	    .kendoUpload({
	    	"multiple":false,
	        async:{
	            saveUrl: "index.cfm?fuseaction=recamalMedicalDB.updateMedicineDS&ID="+options.model.ID,
	            removeUrl: "index.cfm?fuseaction=recamalMedicalDB.updateMedicineDS",
	            saveField: "customSaveField",
	            removeField: "customSaveField",
	            autoUpload: false
	        },
	        
	        upload: onUpload,
	        remove: fn_remove
	    });  
		
		}
	else
		{
		
		$('<input name="ATTACHMENT" id="ATTACHMENT" data-role="upload" type="file" accept=".jpg, .png, .jpeg, .bmp|images/*"/>')
	    .appendTo(container)
	    .kendoUpload({
	    	"multiple":false,
	        async:{
	            saveUrl: "index.cfm?fuseaction=recamalMedicalDB.addNewMedicineDataDS",
	            removeUrl: "index.cfm?fuseaction=recamalMedicalDB.addNewMedicineDataDS",
	            saveField: "customSaveField",
	            removeField: "customSaveField",
	            //batch: true,
	            autoUpload: false
	        },
	        
	        upload: onUpload,
	        remove: fn_remove
	        
	    });  
		
		}
	
	function fn_cancel(e)
	{
		
	}
	
	function fn_remove(e)
	{
		
		$(".k-upload-files.k-reset").find("li").remove();
		
		e.preventDefault();
		
	}
	
	 function onUpload(e) {
		
	        // Array with information about the uploaded files
	        var files = e.files;
	 // Check the extension of each file and abort the upload if it is not .jpg
    $.each(files, function () {
    	
    	
        if (this.extension.toLowerCase() == ".jpg" || this.extension.toLowerCase() == ".png" || this.extension.toLowerCase() == ".bmp" ||  this.extension.toLowerCase() == ".jpeg") {
           if(this.size > 500000)
        	   {
        	   alert("File size above 500KB not allowed.")
       		e.preventDefault();
        	   
        	   }        	
        }
        else
        	{
        	 alert("Only image files can be uploaded")
        		e.preventDefault();
        	
        	}
       
        if (files.length > 1) {
        	
            alert("Please select single file.");
            e.preventDefault();
        }
        
    });
	 }
        
	$('#medicinesDataGrid').data('kendoGrid').refresh();	      
};


var formTypeData = new kendo.data.DataSource({
    data: [
        { FormTypeName: "YES ", FormTypeId: "REIMBURSABLE"},
        { FormTypeName: "NO ", FormTypeId: "NON-REIMBURSABLE"},
        { FormTypeName: "PAR", FormTypeId: "PAR" }
    ]
});

var reimbursibleStatusData = new kendo.data.DataSource({
    data: [
         {reimbursibleStatuName: "Select ", reimbursibleStatuTypeId: "" },
        {reimbursibleStatuName: "REIMBURSABLE", reimbursibleStatuTypeId: "REIMBURSABLE" },
        { reimbursibleStatuName: "NON-REIMBURSABLE", reimbursibleStatuTypeId: "NON-REIMBURSABLE" },
        { reimbursibleStatuName: "PAR", reimbursibleStatuTypeId: "PAR" },
        { reimbursibleStatuName: "REJECTED", reimbursibleStatuTypeId: "REJECTED" }
    ]
});



function reimbursibleStatusDropDownEditor(container, options) {
	$('<input name="REIMBURSIBLE" data-text-field="reimbursibleStatuName" data-value-field="reimbursibleStatuTypeId" data-bind="value:' + options.field + '"/>')
	            .appendTo(container)
	           .kendoDropDownList ({
	                  dataSource: reimbursibleStatusData,
	                  dataTextField: "reimbursibleStatuName",
	                  dataValueField:"reimbursibleStatuTypeId"
	         });
	};


function formTypeDropDownEditor(container, options) {
	$('<input name="REIMBURSIBLE" data-text-field="FormTypeName" data-value-field="FormTypeId" data-bind="value:' + options.field + '"/>')
	            .appendTo(container)
	           .kendoDropDownList ({
	                  dataSource: formTypeData,
	                  dataTextField: "FormTypeName",
	                  dataValueField:"FormTypeId"
	         });
	};



function resetFilter() {
	$('#medicinesDataGrid .k-filter-row .k-widget .k-input').each(function(){
		$(this).val('');
	});
    var datasource = $("#medicinesDataGrid").data("kendoGrid").dataSource;
    datasource.filter([]);
    
}


function resetFilter1() {
	$('#approvalDataGrid .k-filter-row .k-widget .k-input').each(function(){
		$(this).val('');
	});
    var datasource = $("#approvalDataGrid").data("kendoGrid").dataSource;
    datasource.filter([]);
    
}


function downloadAttachment(docId) {
	 $.fileDownload('index.cfm?fuseaction=recamalMedicalDB.downloadDocument&personDocumentId='+docId);
};


function onSuccess(e){	
	$("#uploadedFile").val(e.files[0].name);
}

//--- Popup Editor Custom Validation -- //	

function _medicinenamevalidation(input) {
	 
	
	 if (input.is("[name='MEDICINE_NAME']")){
		 var inputVal = input.val();
		 if (inputVal == "") {
			 input.attr("data-medicinenamevalidation-msg", "Medicine Name is required");
	 		 setClearValidationOnClick(input);	 	
	 		 return false;
	     } 
	 }
	 	
	 return true;
}


function setClearValidationOnClick(input){
	if(input){
		// If a user clicks on this input or moves focus to it, then clear the validation
		input.unbind("click").bind("click", function(e){
			$("div.k-tooltip-validation").hide();
		 });
		input.on("focus", function(e){
			$("div.k-tooltip-validation").hide();
		 });
	}
	// Lets make sure the validation message is moved a bit to the right too.
	$("div.k-tooltip-validation").css("margin-left", "2.5em");
}



//Prevent desired field(s) from being shown in the popup editor
function _hideFieldInEditor(container, options){
	
	 $('label[for=APP_DATE]').parent().hide();
	 _globalMedicineName = (options.model.MEDICINE_NAME.trim());
    var grid = $("#medicinesDataGrid").data("kendoGrid");
    grid.bind("edit", function (e) {
    	var btnUpdateElem = $("div[class~='k-window'] div[class~='k-edit-buttons'] a[class~='k-grid-update']");
    	if(options.model.MEDICINE_NAME.trim() != ""){
    		// We have a Login which means we are in Edit mode
    		
    		$('label[for=REIMBURSIBLE]').parent().show();
   		 $("[name='REIMBURSIBLE']").parent().show();
    		
        	btnUpdateElem.html(btnUpdateElem.html().replace(getString('Create'), getString('Update')));
    	}else{
    		// Otherwise we are in Create mode, so lets change the button word to 'create'
    		 $('label[for=REIMBURSIBLE]').parent().hide();
    		 $("[name='REIMBURSIBLE']").parent().hide();
    		 
    		btnUpdateElem.html(btnUpdateElem.html().replace(getString('Update'), getString('Create')));
    	}
    });
}


//--- CRUD events handlers  --- //

function _addNewMedicine(e) { 
	
	if (e.responseJSON.TEXT=="Success") {
		if (!e.responseJSON.ERROR) {
			$('#medicinesDataGrid').data('kendoGrid').dataSource.read();
			$('#medicinesDataGrid').data('kendoGrid').refresh();
			if(isRecamalHQMode == 1)
			{
				$('#approvalDataGrid').data('kendoGrid').dataSource.read();
				$('#approvalDataGrid').data('kendoGrid').refresh();
			}
			if(_globalMedicineName != ""){
				$('#medicinesDataGrid').data('kendoGrid').dataSource.read({"MEDICINE_NAME" : _globalMedicineName}); 
				$('#medicinesDataGrid').data('kendoGrid').refresh();
				if(isRecamalHQMode == 1)
				{
					$('#approvalDataGrid').data('kendoGrid').dataSource.read();
					$('#approvalDataGrid').data('kendoGrid').refresh();
				}
			}
	    	// Show success message
			toastr.success(getString('Success'));
		}
		else {
			//alert("update db error..");
			toastr.error(textStatus,getString('Error'));
		}
	}
	else {
	  
		window.alert(e.responseJSON.TEXT);
		
		$('#medicinesDataGrid').data('kendoGrid').dataSource.read();
		$('#medicinesDataGrid').data('kendoGrid').refresh();
		if(isRecamalHQMode == 1)
		{
			$('#approvalDataGrid').data('kendoGrid').dataSource.read();
			$('#approvalDataGrid').data('kendoGrid').refresh();
			var datasource = $("#approvalDataGrid").data("kendoGrid").dataSource;
			datasource.filter([]);
		}
	} 
}

function _updateMedicine(e,data) { 	
	if (e.responseJSON.TEXT=="success") {
		if (!e.responseJSON.ERROR) {
			$('#medicinesDataGrid').data('kendoGrid').dataSource.read();
			$('#medicinesDataGrid').data('kendoGrid').refresh();
			if(isRecamalHQMode == 1)
			{
				$('#approvalDataGrid').data('kendoGrid').dataSource.read();
				$('#approvalDataGrid').data('kendoGrid').refresh();
			}
			if(_globalMedicineName != ""){
				
				 var datasource = $("#approvalDataGrid").data("kendoGrid").dataSource;
				    datasource.filter([]);
				    var datasource_main = $("#medicinesDataGrid").data("kendoGrid").dataSource;
				    datasource_main.filter([]);
				    $('#medicinesDataGrid').data('kendoGrid').dataSource.read();
					$('#medicinesDataGrid').data('kendoGrid').refresh();
					if(isRecamalHQMode == 1)
					{
						$('#approvalDataGrid').data('kendoGrid').dataSource.read();
						$('#approvalDataGrid').data('kendoGrid').refresh();
					}
			}
	    	    	
		}
		else {
			
			toastr.error(textStatus,getString('Error'));
		}
	}
	else {
	 
		var reply = confirm(e.responseJSON.TEXT);
		if(reply == true)
			{
			var createDuplicate = $.ajax({
				  url: "index.cfm?fuseaction=recamalMedicalDB.addDuplicateMedicineDataDS",
				  type: "POST",
				  cache: false,
				  data: {attributes :  e.responseJSON.ATTRIBUTES},
				  dataType: "json"
				});
			
			createDuplicate.done(function(e) {
				if (e.TEXT=="Success") {
					if (!e.ERROR) {
						$('#medicinesDataGrid').data('kendoGrid').dataSource.read();
						$('#medicinesDataGrid').data('kendoGrid').refresh();
						if(isRecamalHQMode == 1)
						{
							$('#approvalDataGrid').data('kendoGrid').dataSource.read();
							$('#approvalDataGrid').data('kendoGrid').refresh();
						}
						if(_globalMedicineName != ""){
							$('#medicinesDataGrid').data('kendoGrid').dataSource.read({"MEDICINE_NAME" : _globalMedicineName}); 
							$('#medicinesDataGrid').data('kendoGrid').refresh();
							if(isRecamalHQMode == 1)
							{
								$('#approvalDataGrid').data('kendoGrid').dataSource.read();
								$('#approvalDataGrid').data('kendoGrid').refresh();
							}
						}
				    	    	
					}
					else {
						
						toastr.error(textStatus,getString('Error'));
					}
				}
				  
				});
			createDuplicate.fail(function(jqXHR, textStatus) {
				  alert( "Request failed: " + textStatus );
				});
			
			}
		
		else
			{
				$('#medicinesDataGrid').data('kendoGrid').dataSource.read();
				$('#medicinesDataGrid').data('kendoGrid').refresh();
			
			}		
	} 	
	
}



function _disapproveMedicineDS(e)
{
	
	if (e.responseJSON.TEXT=="success") {
		
		if (!e.responseJSON.ERROR) {
			
			$('#approvalDataGrid').data('kendoGrid').dataSource.transport.read();
			$('#approvalDataGrid').data('kendoGrid').refresh();
			if(_globalMedicineName != ""){
				$('#approvalDataGrid').data('kendoGrid').dataSource.transport.read({"MEDICINE_NAME" : _globalMedicineName}); 
				$('#approvalDataGrid').data('kendoGrid').refresh();
			}	
			
			toastr.success(getString('Delete Success'));
		}
		else {
			toastr.error(textStatus,getString('Error'));
		}
	}
	else {
	    toastr.error(getString('Error occurred'),getString('Error'));
	} 

}


function textareaEditor(container, options) {
    $('<textarea data-bind="value: ' + options.field + '" cols="20" rows="2"></textarea>')
        .appendTo(container);
}

function medicineNameEditor(container, options) {
    $('<textarea id ="MEDICINE_NAME" data-bind="value: ' + options.field + '" cols="20" rows="1"></textarea>')
        .appendTo(container);
}

function catchExportExcel(e, fileType){
	/*
	 * This function is used to include hidden fields in the Excel export file.
	 * If there is ever a column which we don't want to include, we can
	 * instead specify the showColumn with the column title for each other column which we do.
	 */
    if (!global_exportFlag) {
    	var columns = e.sender.columns;
    	shownColumns = [];
    	for(j=0; j < columns.length; j++)
        {
			if(columns[j].hidden == true)
			{
				shownColumns.push(columns[j].title);
				e.sender.showColumn(j);
			}
        }
    	if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
    	global_exportFlag = true;
    	setTimeout(function () {
            e.sender.saveAsExcel();
        });



    } else {
    	var columns = e.sender.columns;
    	for(j=0; j < columns.length; j++)
        {
    		for(i=0; i < shownColumns.length; i++)
	        {
    			if(shownColumns[i] == columns[j].title){
    				e.sender.hideColumn(j);
    			}
	        }
        }

        global_exportFlag = false;
        return true;
    }
}

/*
 @sentryFeatures - array with available sentry features
 */

function getMedicinesGridToolbarConfig() {
	var config = [] ;
	var createButton = { name: 'create', text: getString('Add New Medicine') };
	
	//if access to excel export restricted then don't shoe the toolbar button
	// if(recamaleExportExcelMode) {
	// 	config.push({ name: 'excel'});
	// }
	
	config.push(createButton);
	
	return config;
}

function setMedicineGridFileds() {
	var recamalHQFileds = [];
	var fields = [
	{field: 'MEDICINE_NAME', width: "100px", title: getString('Name'), filterable: {cell: {showOperators: false}}},
    {field: 'COMPOSITION', width: "150px",title:getString('Composition'), editor: textareaEditor, filterable: {extra: false, cell: {showOperators: false}}},
    {field: 'REIMBURSIBLE',width: "50px", title:getString('Reimbursible'), editor: formTypeDropDownEditor, filterable: {extra: false, cell: {showOperators: false}}},
    {field: 'USAGE', width: "150px", title:getString('Usage'), editor: textareaEditor, filterable: {extra: false, cell: {showOperators: false}}},
    {field: 'COMMENTS',  width: "150px", title:getString('Comments'), editor: textareaEditor, filterable: {extra: false, cell: {showOperators: false}}},
    {field: 'APP_DATE', width: "80px", title: getString('Last Updated'), format: "{0:dd/MM/yyyy}",editable: false, editor: _hideFieldInEditor ,
  	  filterable: {
  		  extra: false,
      	  cell: {
              	template: function (e) {
              		e.element.kendoDatePicker({
              			format: "dd/MM/yyyy"
                      }).data("kendoDatePicker");
              	},
                  showOperators: false
              }
  	  }
    },
    {field: 'LINK', width: "100px", title: getString('Url Link'), template: '# if(LINK) { # <a href="#= LINK #" target="_blank">Link</a> # } #', filterable: {cell: {showOperators: false}}},
    {field: 'ATTACHMENT',  title:getString('File'),
		  editor: fileUploadEditor,
		  filterable: {
            cell: {
                enabled: false
            }
        },
        width: "100px",
        sortable: false,
		
		  template:  function(dataItem) {
	 			var returnStr = '';
	 			if(dataItem.ATTACHMENT == 1 && isRecamalHQMode) {
	 				returnStr += 
	 				'<span id="undo" style="height: 26px; margin: 0px 2px; min-width: 64px;" class="k-button" onclick="myFunction('+dataItem['ID']+');">View</span>'
	 			} else {
	 				returnStr += '';
	 			}
	 			return returnStr;
	 		}
    } ,
  	
	  { command: [
            {name:"edit",
          	  template: 
				  	"<a id ='edit_btn' class='k-button k-grid-edit btn btn-primary btn-xs no-icon btn-no-min-width btn-center-padding ' href=''>"+getString('Edit')+"</a>"
				}
            ],
  	title: getString('Action'), width: "100px"
		 }
    ];
	
	//if Local agent or staff in the Delegation display only first 3 columns
	if(!isRecamalHQMode) {
		for(var i = 0;i < fields.length; i++) {
			if(fields[i].field !== 'MEDICINE_NAME' && fields[i].field !== 'COMPOSITION' && fields[i].field !== 'REIMBURSIBLE' && !fields[i].command) {
				//hide fields
				fields[i]['hidden'] = true;
			}
		}
	}
	
	//if user doesn't have rights to view usage colums then remove it
	if(!recamaleUsageColMode) {
		//find index of usage field
		for(var i = 0;i < fields.length; i++) {
			if(fields[i].field === 'USAGE') {
				//remove object
				fields.splice(i, 1);
			}
		} 
	}
	
	return fields;
}

function getString(str){
    return str;
}