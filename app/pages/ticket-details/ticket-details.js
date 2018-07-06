"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ionic_angular_1 = require("ionic-angular");
var config_1 = require("../../providers/config");
var data_provider_1 = require("../../providers/data-provider");
var ticket_provider_1 = require("../../providers/ticket-provider");
var helpers_1 = require("../../directives/helpers");
var posts_list_1 = require("../../components/posts-list/posts-list");
var select_list_1 = require("../../components/select-list/select-list");
var class_list_1 = require("../../components/class-list/class-list");
var location_list_1 = require("../../components/location-list/location-list");
var modals_1 = require("../../pages/modals/modals");
var timelog_1 = require("../../pages/timelog/timelog");
var expense_create_1 = require("../../pages/expense-create/expense-create");
var pipes_1 = require("../../pipes/pipes");
var add_files_1 = require("../../pages/modals/add-files/add-files");
var todo_list_1 = require("../../components/todo-list/todo-list");
var core_1 = require("@angular/core");
var ionic_angular_2 = require("ionic-angular");
var config_2 = require("../../providers/config");
var UploadButtonComponent = (function () {
    function UploadButtonComponent(nav, renderer, config) {
        this.nav = nav;
        this.renderer = renderer;
        this.config = config;
        this.filesSelected = new core_1.EventEmitter(false);
        this.filesUploaded = new core_1.EventEmitter(false);
        this.allowMultiple = true;
        this.multi = "multiple";
        this.error = "";
        this.files = [];
        this.MAX_SIZE = 4194304;
        if (this.allowMultiple === false) {
            this.multi = "";
        }
    }
    UploadButtonComponent.prototype.ngOnInit = function () {
    };
    UploadButtonComponent.prototype.upload = function (url, files) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    }
                    else {
                        reject(xhr.response);
                    }
                }
            };
            var token = _this.config.getCurrent("key"), org = _this.config.getCurrent("org"), inst = _this.config.getCurrent("instance");
            xhr.open('POST', url + "files/", true);
            xhr.setRequestHeader("Authorization", "Basic " + btoa(org + "-" + inst + ":" + token));
            var formData = new FormData();
            for (var key in _this.fileDest) {
                formData.append(key, _this.fileDest[key]);
            }
            for (var i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].upload_name);
            }
            xhr.send(formData);
        });
    };
    UploadButtonComponent.prototype.onUpload = function (is_Close) {
        var _this = this;
        if (!this.files.length) {
            this.filesUploaded.next("ok" + " no files " + (is_Close ? " on close" : ""));
            return;
        }
        if (this.in_progress && Date.now() - this.in_progress < 1500) {
            return;
        }
        this.in_progress = Date.now();
        var loading = null;
        if (this.files.length >= 2 || this.files[0].size > 20000) {
            loading = ionic_angular_2.Loading.create({
                content: "Uploading file(s)...",
                dismissOnPageChange: true
            });
            this.nav.present(loading);
        }
        this.upload(config_2.ApiSite, this.files).then(function (data) {
            _this.reset();
            if (loading)
                loading.dismiss();
            _this.filesUploaded.next("ok " + data + (is_Close ? " on close" : ""));
        }).catch(function (ex) {
            if (loading) {
                setTimeout(function () { return loading.dismiss(); }, 1000);
            }
            console.error('Error uploading files', ex);
            _this.filesUploaded.next("error " + ex);
            _this.nav.alert('Error uploading files! Cannot add files! Please try again later ... or try to upload one file or check your internet connection', true);
        });
    };
    UploadButtonComponent.prototype.reset = function (file) {
        if (file) {
            this.files = this.files.filter(function (item) { return item !== file; });
            this.filesSelected.next(this.files.map(function (item) { return item.upload_name; }));
        }
        if (!file || !this.files.length) {
            this.error = "";
            this.files = [];
            this.nativeInputBtn.nativeElement.value = '';
        }
    };
    UploadButtonComponent.prototype.callback = function (event) {
        this.log("UploadButton: Callback executed triggerig click event", this.nativeInputBtn.nativeElement);
        var clickEvent = new MouseEvent("click", { bubbles: true });
        this.renderer.invokeElementMethod(this.nativeInputBtn.nativeElement, "dispatchEvent", [clickEvent]);
    };
    UploadButtonComponent.prototype.filesAdded = function (event) {
        this.log("UploadButton: Added files", this.nativeInputBtn.nativeElement.files);
        var len = this.nativeInputBtn.nativeElement.files.length;
        var checkfiles = [];
        this.error = "";
        if (len) {
            var selNames = {}, existNames = {};
            if (this.filesExist)
                for (var j = 0; j < this.filesExist.length; j++) {
                    existNames[this.filesExist[j].name.trim()] = this.filesExist[j].size;
                }
            for (var i = 0; i < len; i++) {
                var file = this.nativeInputBtn.nativeElement.files[i];
                if (this.isFile(file)) {
                    if (file.size > this.MAX_SIZE)
                        this.error += "File " + file.name + " will be skipped. It is more 4 MB<br>";
                    else if (file.size === 0)
                        this.error += "File " + file.name + " will be skipped. It has zero size <br>";
                    else if (!file.name.trim())
                        this.error += "File #" + i + " will be skipped. It has empty name<br>";
                    else {
                        var new_name = file.name.trim();
                        if (file.size != (existNames[new_name.trim()] || file.size))
                            new_name = this.add_tag(new_name, file.size);
                        if (file.size != (selNames[new_name] || file.size))
                            new_name = this.add_tag(new_name, file.size);
                        file.upload_name = new_name;
                        checkfiles.push(file);
                        selNames[new_name] = file.size;
                    }
                }
                else {
                    this.error += "File #" + i + " will be skipped. It is empty<br>";
                }
            }
        }
        this.files = checkfiles;
        this.filesSelected.next(this.files.map(function (item) { return item.upload_name; }));
    };
    UploadButtonComponent.prototype.add_tag = function (name, tag) {
        var index = name.lastIndexOf("."), len = name.length;
        return name.substr(0, index) + "_" + tag + name.substr(index, len);
    };
    UploadButtonComponent.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.logCallback) {
            console.log(args);
        }
    };
    UploadButtonComponent.prototype.humanizeBytes = function (bytes) {
        if (bytes === 0) {
            return '0 Byte';
        }
        var k = 1024;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    UploadButtonComponent.prototype.isImage = function (url) {
        if (!url || url.trim().match(/(jpeg|jpg|gif|png|ico)$/i) === null)
            return "md-document";
        return "md-image";
    };
    UploadButtonComponent.prototype.isFile = function (file) {
        return file !== null && file instanceof Blob;
    };
    __decorate([
        core_1.ViewChild("input"),
        __metadata("design:type", core_1.ElementRef)
    ], UploadButtonComponent.prototype, "nativeInputBtn", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], UploadButtonComponent.prototype, "filesSelected", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], UploadButtonComponent.prototype, "filesUploaded", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UploadButtonComponent.prototype, "fileDest", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], UploadButtonComponent.prototype, "filesExist", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], UploadButtonComponent.prototype, "btnStyle", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], UploadButtonComponent.prototype, "allowMultiple", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Function)
    ], UploadButtonComponent.prototype, "logCallback", void 0);
    UploadButtonComponent = __decorate([
        core_1.Component({
            selector: "upload-button",
            directives: [ionic_angular_2.IONIC_DIRECTIVES],
            templateUrl: 'build/components/upload-button/upload-button.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, core_1.Renderer, ionic_angular_1.Config])
    ], UploadButtonComponent);
    return UploadButtonComponent;
}());
exports.UploadButtonComponent = UploadButtonComponent;
var TicketDetailsPage = (function () {
    function TicketDetailsPage(nav, navParams, ticketProvider, dataProvider, config) {
        this.nav = nav;
        this.navParams = navParams;
        this.ticketProvider = ticketProvider;
        this.dataProvider = dataProvider;
        this.config = config;
        this.ticket = {};
        this.waiting_response = false;
        this.is_editworkpad = true;
        this.cachename = "";
        this.closed_index = 0;
        this.fileDest = { ticket: "" };
        this.files = [];
        this.is_showlogs = false;
        this.posts = [
            {
                "id": 0,
                "ticket_key": "",
                "user_id": 0,
                "user_email": " ",
                "user_firstname": " ",
                "user_lastname": " ",
                "record_date": "2016-01-01T00:00:00.0000000",
                "log_type": "Initial Post",
                "note": " ",
                "workpad": " ",
                "ticket_time_id": 0,
                "sent_to": " ",
                "is_waiting": false,
                "sla_used": 0
            }
        ];
    }
    TicketDetailsPage.prototype.onPageLoaded = function () {
        this.ticket.customfields = [];
        this.active = true;
        this.he = this.config.getCurrent("user");
        this.details_tab = "Reply";
        var data = this.navParams.data || {};
        this.cachename = data.cachename;
        this.posts[0].record_date = data.updated_time || this.posts[0].record_date;
        this.is_showlogs = false;
        this.ticketnote = "";
        this.fileDest = { ticket: data.key };
        this.getPosts(data.key);
        this.processDetails(data, true);
    };
    TicketDetailsPage.prototype.initSelects = function (data) {
        var account_id = data.account_id || -1;
        this.username = helpers_1.getFullName(data.user_firstname, data.user_lastname, data.user_email);
        this.techname = helpers_1.getFullName(data.technician_firstname || data.tech_firstname, data.technician_lastname || data.tech_lastname, data.technician_email || data.tech_email);
        this.select_button = {
            "tech": {
                name: "Tech",
                value: "Transfer " + this.config.current.names.ticket.s,
                selected: data.tech_id,
                url: "technicians",
                hidden: false
            },
        };
        this.selects = {
            "user": {
                name: "User",
                value: this.username,
                selected: data.user_id,
                url: "users",
                hidden: false
            },
            "location": {
                name: "Location",
                value: data.location_name || "( Not Set )",
                selected: data.location_id || 0,
                url: "locations?account=" + account_id + "&limit=500",
                hidden: false
            },
            "tech": {
                name: "Tech",
                value: this.techname,
                selected: data.tech_id,
                url: "technicians",
                hidden: false
            },
            "project": {
                name: "Project",
                value: data.project_name || "( Not Set )",
                selected: data.project_id || 0,
                url: "projects?account=" + account_id + "&is_with_statistics=false",
                hidden: false
            },
            "level": {
                name: "Level",
                value: data.level_name ? (data.level + " - " + data.level_name) : "( Not Set )",
                selected: data.level || 0,
                url: "levels",
                hidden: false
            },
            "priority": {
                name: "Priority",
                value: data.priority_name ? (data.priority + " - " + data.priority_name) : "( Not Set )",
                selected: data.priority_id || 0,
                url: "priorities",
                hidden: false
            },
            "class": {
                name: "Class",
                value: data.class_name || "( Not Set )",
                selected: data.class_id || 0,
                url: "classes",
                hidden: false
            }
        };
        this.selects.account = {
            name: "Account",
            value: (data.account || {}).name || data.account_name || this.he.account_name,
            selected: account_id,
            url: "accounts?is_with_statistics=false",
            hidden: false
        };
    };
    TicketDetailsPage.prototype.uploadedFile = function (event) {
        if (event.indexOf("ok") == 0) {
            this.onSubmit(!this.config.current.user.is_techoradmin && this.ticket.status != 'Closed' && ~event.indexOf("close"));
        }
    };
    TicketDetailsPage.prototype.selectedFile = function (event) {
        this.files = event;
        this.ticketnote = this.ticketnote.trim();
        if (event.length && !this.ticketnote) {
            this.ticketnote = "  ";
        }
    };
    TicketDetailsPage.prototype.getPosts = function (key) {
        var _this = this;
        this.ticketProvider.getTicketDetails(key).subscribe(function (data) {
            _this.processDetails(data);
        }, function (error) {
            console.log(error || 'Server error');
            _this.redirectOnEmpty();
        });
    };
    TicketDetailsPage.prototype.getProfile = function (user_id) {
        var _this = this;
        this.ticketProvider.getUserProfile(user_id).subscribe(function (data) {
            _this.userphone = data.mobile_phone || data.phone;
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.processDetails = function (data, isShortInfo) {
        if (!isShortInfo && (!data || !data.ticketlogs || data.ticketlogs == 0)) {
            this.redirectOnEmpty();
            return;
        }
        this.ticket = data;
        this.is_editworkpad = !(this.ticket.workpad || "").length;
        this.ticket.customfields = [];
        this.ticket.mailto = "r." + this.config.current.org + "." + this.config.current.instance + "." + data.key + "@app.sherpadesk.com";
        this.initSelects(data);
        if (data.ticketlogs && data.ticketlogs.length > 0)
            this.posts = data.ticketlogs;
        if (!isShortInfo) {
            this.attachments = (data.attachments || []).slice().reverse();
            var xml = helpers_1.parseXml(this.ticket.customfields_xml);
            if (xml) {
                var t = [];
                for (var n = xml.documentElement.firstChild; n; n = n.nextSibling) {
                    t.push({ "id": n.attributes[0].nodeValue, "name": n.firstChild.innerHTML.replace("&amp;amp;", "&amp;"), "value": (n.firstChild.nextSibling.innerHTML || "").replace("&amp;amp;", "&amp;") });
                }
                this.ticket.customfields = t;
            }
        }
        else {
            this.getProfile(data.user_id);
        }
    };
    TicketDetailsPage.prototype.redirectOnEmpty = function () {
        var _this = this;
        this.nav.alert('Incorrect ticket. Going back...', true);
        setTimeout(function () {
            _this.nav.pop();
        }, 1000);
    };
    TicketDetailsPage.prototype.saveSelect = function (event) {
        var name = event.type;
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
        switch (name) {
            case "account":
                this.selects.project.url = "projects?account=" + event.id + "&is_with_statistics=false";
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                this.selects.location.url = "locations?account=" + event.id + "&limit=500";
                this.selects.location.value = "Default";
                this.selects.location.selected = 0;
                break;
        }
    };
    TicketDetailsPage.prototype.onSubmit = function (isClose) {
        var _this = this;
        if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        var post = helpers_1.htmlEscape(this.ticketnote.trim()).substr(0, 5000);
        if (isClose && this.files.length || !isClose) {
            this.ticketProvider.addTicketPost(this.ticket.id, post, this.files, this.waiting_response).subscribe(function (data) {
                if (!isClose) {
                    _this.nav.alert('New post added :)');
                    _this.ticketnote = "";
                    _this.active = false;
                    setTimeout(function () { return _this.active = true; }, 0);
                    _this.getPosts(_this.ticket.key);
                }
                _this.files = [];
            }, function (error) {
                _this.nav.alert(error, true);
                console.log(error || 'Server error');
            });
        }
        if (isClose) {
            this.onClose(true);
        }
    };
    TicketDetailsPage.prototype.saveNote = function (form) {
        var _this = this;
        var note = helpers_1.htmlEscape((form.value || "").trim()).substr(0, 5000);
        if (note != (this.ticket.note || "").trim()) {
            this.ticketProvider.addTicketNote(this.ticket.id, note).subscribe(function (data) { return _this.saveNoteSuccess(note); }, function (error) {
                _this.nav.alert(error, true);
                console.log(error || 'Server error');
            });
        }
        else
            this.saveNoteSuccess(note);
    };
    TicketDetailsPage.prototype.saveWorkpad = function (form) {
        var _this = this;
        var workpad = (form.value || "").trim().replace(/\n/g, "<p>");
        if (workpad != (this.ticket.workpad || "").trim()) {
            this.ticketProvider.addTicketWorkpad(this.ticket.id, workpad).subscribe(function (data) { return _this.saveWorkpadSuccess(workpad); }, function (error) {
                _this.nav.alert(error, true);
                console.log(error || 'Server error');
            });
        }
        else
            this.saveWorkpadSuccess(workpad);
    };
    TicketDetailsPage.prototype.openAlert = function (name, value) {
        if (!value || value.length < 22)
            return;
        var alert = ionic_angular_1.Alert.create({
            title: name,
            subTitle: value,
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel',
                }
            ]
        });
        this.nav.present(alert);
    };
    TicketDetailsPage.prototype.saveWorkpadSuccess = function (workpad) {
        this.nav.alert('Workpad saved :)');
        this.ticket.workpad = (workpad || "").trim();
        this.is_editworkpad = !this.ticket.workpad.length;
    };
    TicketDetailsPage.prototype.saveNoteSuccess = function (note) {
        this.nav.alert('Note saved :)');
        this.ticket.note = (note || "").trim();
    };
    TicketDetailsPage.prototype.onClose = function (isForce) {
        var _this = this;
        if (!isForce && this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        var post = helpers_1.htmlEscape(this.ticketnote.trim()).substr(0, 5000);
        var data = {
            "status": "closed",
            "note_text": post,
            "is_send_notifications": true,
            "resolved": true,
            "resolution_id": 0,
            "confirmed": true,
            "confirm_note": ""
        };
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.update_tlist_logic(true);
            _this.nav.alert(_this.config.current.names.ticket.s + ' has been closed :)');
            _this.ticket.status = "Closed";
            if (post.length) {
                _this.ticketnote = "";
                _this.active = false;
                setTimeout(function () { return _this.active = true; }, 0);
                _this.files = [];
                _this.getPosts(_this.ticket.key);
            }
        }, function (error) {
            _this.nav.alert(error, true);
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.onHold = function () {
        var _this = this;
        if (this.ticket.status == "OnHold") {
            this.reopenTicket();
            return;
        }
        var prompt = ionic_angular_1.Alert.create({
            title: 'Place On Hold #' + this.ticket.number,
            inputs: [
                {
                    name: 'note',
                    placeholder: 'Note'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Place On Hold',
                    handler: function (data) {
                        var post = helpers_1.htmlEscape(data.note.trim()).substr(0, 4000);
                        var data1 = {
                            "status": "onhold",
                            "note_text": post
                        };
                        _this.ticketProvider.closeOpenTicket(_this.ticket.key, data1).subscribe(function (data) {
                            _this.ticket.status = "OnHold";
                            _this.update_tlist_logic(false);
                            _this.nav.alert(_this.config.current.names.ticket.s + ' placed On Hold :)');
                        }, function (error) {
                            _this.nav.alert(error, true);
                            console.log(error || 'Server error');
                        });
                    }
                }
            ]
        });
        this.nav.present(prompt);
    };
    TicketDetailsPage.prototype.onUpdate = function () {
        var _this = this;
        if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        var data = {
            "class_id": this.selects.class.selected,
            "level_id": this.selects.level.selected,
            "priority_id": this.selects.priority.selected,
            "project_id": this.selects.project.selected,
            "location_id": this.selects.location.selected,
            "account_id": this.selects.account.selected,
            "tech_id": this.selects.tech.selected,
            "user_id": this.selects.user.selected
        };
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.nav.alert(_this.config.current.names.ticket.s + ' was successfully updated :)');
            _this.getPosts(_this.ticket.key);
        }, function (error) {
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.transferTicket = function (event) {
        var _this = this;
        if (!event)
            return;
        var techid = event.id;
        this.select_button.tech.selected = techid;
        this.select_button.tech.value = "Transfer " + this.config.current.names.ticket.s;
        var data = {
            "tech_id": techid
        };
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.nav.alert(_this.config.current.names.ticket.s + ' has been transferred :)');
            _this.techname = _this.selects.tech.value = _this.ticket.tech_firstname = event.name;
            _this.ticket.tech_lastname = _this.ticket.tech_email = "";
            _this.selects.tech.selected = techid;
        }, function (error) {
            _this.nav.alert(error, true);
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.pickUp = function () {
        var _this = this;
        var data = {
            "action": "pickup",
            "note_text": ""
        };
        if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.nav.alert(_this.config.current.names.ticket.s + ' pickup was Succesfull!');
            _this.techname = _this.selects.tech.value = _this.ticket.tech_firstname = helpers_1.getFullName(_this.he.firstname, _this.he.lastname, _this.he.email);
            _this.ticket.tech_lastname = _this.ticket.tech_email = "";
            _this.selects.tech.selected = _this.he.user_id;
        }, function (error) {
            _this.nav.alert(error, true);
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.onDelete = function (file) {
        var _this = this;
        var data = {
            "ticket": this.ticket.key,
            "file_id": file.id
        };
        this.dataProvider.deleteFile(data).subscribe(function (data) {
            _this.attachments = _this.attachments.filter(function (item) { return item !== file; });
            _this.getPosts(_this.ticket.key);
            _this.nav.alert("File " + file.name + " deleted!");
        }, function (error) {
            _this.nav.alert(error, true);
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.reopenTicket = function () {
        var _this = this;
        var data = {
            "status": "open",
            "note_text": ""
        };
        this.ticketProvider.closeOpenTicket(this.ticket.key, data).subscribe(function (data) {
            _this.update_tlist_logic(false);
            _this.nav.alert(_this.config.current.names.ticket.s + ' has been Reopened!');
            _this.ticket.status = "Open";
        }, function (error) {
            _this.nav.alert(error, true);
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.update_tlist_logic = function (is_close) {
        var _this = this;
        if (this.cachename) {
            if (~this.cachename.indexOf("closed")) {
                is_close = !is_close;
                this.closed_index = 0;
            }
            if (is_close) {
                this.closed_index = this.ticketProvider._dataStore[this.cachename].findIndex(function (tkt) { return tkt.key === _this.ticket.key; });
                this.ticketProvider._dataStore[this.cachename].splice(this.closed_index, 1);
                if (~this.cachename.indexOf("closed")) {
                    this.ticketProvider._dataStore[this.cachename.replace("closed", "open")].splice(0, 0, this.ticket);
                }
            }
            else {
                this.ticketProvider.getTicketsList(this.cachename, "", "", { "limit": 25 });
                this.ticketProvider._dataStore[this.cachename].splice(this.closed_index, 0, this.ticket);
                var index = this.ticketProvider._dataStore[this.cachename].findIndex(function (tkt) { return tkt.key === _this.ticket.key; });
                if (~this.cachename.indexOf("closed")) {
                    this.ticketProvider._dataStore[this.cachename.replace("open", "closed")].splice(this.ticketProvider._dataStore[this.cachename.replace("open", "closed")].findIndex(function (tkt) { return tkt.key === _this.ticket.key; }), 1);
                }
            }
        }
    };
    TicketDetailsPage.prototype.closeTicket = function () {
        var _this = this;
        if (this.ticket.status == 'Closed') {
            this.reopenTicket();
            return;
        }
        var myModal = ionic_angular_1.Modal.create(modals_1.CloseTicketModal, { "number": this.ticket.number, "key": this.ticket.key, "subject": this.ticket.subject });
        myModal.onDismiss(function (data) {
            if (data) {
                _this.ticket.status = "Closed";
                _this.update_tlist_logic(true);
            }
        });
        this.nav.present(myModal);
    };
    TicketDetailsPage.prototype.addTime = function () {
        var myModal = ionic_angular_1.Modal.create(timelog_1.TimelogPage, { "number": this.ticket.number, "ticket_number": this.ticket.key, "subject": this.ticket.subject, "account_id": this.ticket.account_id });
        this.nav.present(myModal);
    };
    TicketDetailsPage.prototype.addExpense = function () {
        var myModal = ionic_angular_1.Modal.create(expense_create_1.ExpenseCreatePage, { "number": this.ticket.number, "ticket_number": this.ticket.key, "subject": this.ticket.subject, "account_id": this.ticket.account_id });
        this.nav.present(myModal);
    };
    TicketDetailsPage.prototype.addFilesButton = function () {
        console.log("Function connect");
        var myModal = ionic_angular_1.Modal.create(add_files_1.AddFilesModal);
        myModal.onDismiss(function (data1) {
        });
        this.nav.present(myModal);
    };
    TicketDetailsPage.prototype.Escalate = function (is_escalate) {
        var _this = this;
        is_escalate = is_escalate || false;
        if (this.ticket.in_progress && Date.now() - this.ticket.in_progress < 1500) {
            return;
        }
        this.ticket.in_progress = Date.now();
        this.ticketProvider.escalateTicket(this.ticket.key, is_escalate).subscribe(function (data) {
            _this.processDetails(data);
            _this.nav.alert(_this.config.current.names.ticket.s + " was " + (is_escalate ? "escalated" : "de-escalated") + " succesfully!");
        }, function (error) {
            _this.nav.alert(error || "Error! Try again later ...", true);
            console.log(error || 'Server error');
        });
    };
    TicketDetailsPage.prototype.getFullapplink = function (ticketkey) {
        var curr = this.config.getCurrent();
        helpers_1.fullapplink(config_1.AppSite, ticketkey, curr.instance, curr.org);
    };
    TicketDetailsPage.prototype.getMailTolink = function (ticketkey) {
        var curr = this.config.getCurrent();
        helpers_1.mailtolink(ticketkey, curr.instance, curr.org);
    };
    TicketDetailsPage.prototype.getFullName = function (firstname, lastname, email, name) {
        return helpers_1.getFullName(firstname, lastname, email, name);
    };
    TicketDetailsPage.prototype.getCurrency = function (value) {
        return helpers_1.getCurrency(value);
    };
    TicketDetailsPage.prototype.getFileLink = function (file) {
        return helpers_1.FileUrlHelper.getFileLink(file.url, file.name);
    };
    TicketDetailsPage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    TicketDetailsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/ticket-details/ticket-details.html',
            directives: [todo_list_1.TodoListComponent, posts_list_1.PostsListComponent, core_1.forwardRef(function () { return select_list_1.SelectListComponent; }), core_1.forwardRef(function () { return class_list_1.ClassListComponent; }), core_1.forwardRef(function () { return location_list_1.LocationListComponent; }), UploadButtonComponent],
            pipes: [pipes_1.GravatarPipe, pipes_1.LinebreaksPipe, pipes_1.DaysoldPipe, pipes_1.HtmlsafePipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, ticket_provider_1.TicketProvider, data_provider_1.DataProvider, ionic_angular_1.Config])
    ], TicketDetailsPage);
    return TicketDetailsPage;
}());
exports.TicketDetailsPage = TicketDetailsPage;
