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
var core_1 = require("@angular/core");
var helpers_1 = require("../../directives/helpers");
var time_provider_1 = require("../../providers/time-provider");
var class_list_1 = require("../../components/class-list/class-list");
var select_list_1 = require("../../components/select-list/select-list");
var TimelogPage = (function () {
    function TimelogPage(nav, navParams, timeProvider, config, view) {
        this.nav = nav;
        this.navParams = navParams;
        this.timeProvider = timeProvider;
        this.config = config;
        this.view = view;
        this.time = {};
        this.title = "";
        this.selects = {};
        this.minuteValues = [0, 15, 30, 45, 0];
        this.start_time = "";
        this.stop_time = "";
        this.UserDateOffset = -5;
    }
    TimelogPage.prototype.decrement = function () {
        this.timecount = Math.max(Number(this.timecount) - this.inc, 0).toFixed(2);
    };
    TimelogPage.prototype.increment = function () {
        this.timecount = (Number(this.timecount) + this.inc).toFixed(2);
    };
    TimelogPage.prototype.ngAfterViewInit = function () {
    };
    TimelogPage.prototype.AddHours = function (date, hours) {
        if (date) {
            if (date.length == 19)
                date = date.slice(0, -3);
            var temp = new Date(date);
            return new Date(temp.setTime(temp.getTime() + (hours * 60 * 60 * 1000) + -1 * temp.getTimezoneOffset() * 60 * 1000)).toJSON();
        }
        return date;
    };
    TimelogPage.prototype.ngOnInit = function () {
        this.UserDateOffset = this.config.getCurrent("timezone_offset");
        this.time = this.navParams.data || {};
        var name = (this.time.user_name + " " + this.time.user_email).trim().split(' ')[0];
        if (this.time.time_id) {
            this.UserDateOffset = this.time.time_offset;
            this.title = "Timelog #" + this.time.time_id + " by\u00A0" + name + " on\u00A0" + this.setDate(this.AddHours(this.time.date, this.UserDateOffset), false, true);
            this.start_time = this.AddHours(this.time.start_time, this.UserDateOffset);
            this.stop_time = this.AddHours(this.time.stop_time, this.UserDateOffset);
        }
        else if (this.time.number)
            this.title = "#" + this.time.number + " " + this.time.subject;
        else
            this.title = "Add Time";
        this.mintime = this.config.getCurrent("time_minimum_time") || 0.25;
        this.mintime = this.mintime > 0 ? this.mintime : 0.25;
        this.isbillable = this.time.no_invoice;
        this.inc = this.config.getCurrent("time_hour_increment") > 0 ? this.config.getCurrent("time_hour_increment") : 0.25;
        this.displayFormat = helpers_1.getPickerDateTimeFormat(false, true);
        if (this.inc >= 1)
            this.minuteValues = [0];
        else if (this.inc != 0.25) {
            this.minuteValues = [];
            var min = 0;
            do {
                this.minuteValues.push(min);
                min += 5;
            } while (min < 60);
            this.minuteValues.push(0);
        }
        this.timecount = (this.time.hours || this.mintime).toFixed(2);
        this.timenote = helpers_1.linebreaks(this.time.note || "", true);
        this.he = this.config.getCurrent("user");
        var recent = {};
        if (!this.time.number && !this.time.time_id && !(this.time.account || {}).id) {
            recent = this.config.current.recent || {};
        }
        var account_id = (this.time.account || {}).id || this.time.account_id || (recent.account || {}).selected || this.he.account_id || -1;
        var project_id = (this.time.project || {}).id || this.time.project_id || (recent.project || {}).selected || 0;
        this.selects = {
            "account": {
                name: "Account",
                value: (this.time.account || {}).name || this.time.account_name || (recent.account || {}).value || this.he.account_name,
                selected: account_id,
                url: "accounts?is_with_statistics=false",
                hidden: false,
                is_disabled: this.time.ticket_number
            },
            "project": {
                name: "Project",
                value: this.time.project_name || (recent.project || {}).value || "Default",
                selected: project_id,
                url: "projects?account=" + account_id + "&is_with_statistics=false",
                hidden: false,
                is_disabled: this.time.ticket_number
            },
            "ticket": {
                name: "Ticket",
                value: this.time.ticket_number ? "#" + this.time.ticket_number + ": " + this.time.ticket_subject : "Choose (optional)",
                selected: this.time.ticket_number || 0,
                url: "tickets?status=open&account=" + account_id + "&project=" + project_id,
                hidden: this.time.is_project_log || false,
                is_disabled: this.time.task_type_id
            },
            "tasktype": {
                name: "Task Type",
                value: this.time.task_type || (recent.tasktype || {}).value || "Choose",
                selected: this.time.task_type_id || this.config.getRecent("tasktype").selected || 0,
                url: this.time.ticket_number ? "task_types?ticket=" + this.time.ticket_number : "task_types?account=" + account_id,
                hidden: false
            },
            "prepaidpack": {
                name: "PrePaid Pack",
                value: this.time.prepaid_pack_name || (recent.prepaidpack || {}).value || "Choose",
                selected: this.time.prepaid_pack_id || this.config.getRecent("prepaidpack").selected || 0,
                url: "prepaid_packs?account=" + account_id + "&project=" + project_id,
                hidden: false
            }
        };
    };
    TimelogPage.prototype.saveSelect = function (event) {
        var name = event.type;
        var account_id = this.selects.account.selected;
        switch (name) {
            case "account":
                if (this.selects.account.selected === event.id) {
                    break;
                }
                this.selects.project.url = "projects?account=" + event.id + "&is_with_statistics=false";
                this.selects.project.value = "Default";
                this.selects.project.selected = 0;
                this.selects.prepaidpack.url = "prepaid_packs?account=" + event.id + "&project=0";
                this.selects.prepaidpack.value = "Default";
                this.selects.prepaidpack.selected = 0;
                account_id = event.id;
                this.selects.ticket.hidden = this.time.is_project_log || this.time.task_type_id || false;
                this.selects.project.hidden = !this.config.current.is_project_tracking;
                break;
            case "project":
                if (this.selects.project.selected === event.id) {
                    break;
                }
                if (!this.time.task_type_id) {
                    this.selects.ticket.hidden = this.time.is_project_log || this.time.task_type_id || false;
                    this.selects.ticket.url = "tickets?status=open&account=" + account_id + "&project=" + event.id,
                        this.selects.ticket.value = "Choose (optional)";
                    this.selects.ticket.selected = 0;
                }
                this.selects.prepaidpack.url = "prepaid_packs?account=" + account_id + "&project=" + event.id,
                    this.selects.prepaidpack.value = "Choose (optional)";
                this.selects.prepaidpack.selected = 0;
                break;
            case "ticket":
                if (this.selects.ticket.selected === event.id) {
                    break;
                }
                this.selects.tasktype.url = event.id ? "task_types?ticket=" + event.id : "task_types?account=" + account_id;
                this.selects.tasktype.value = "Choose";
                this.selects.tasktype.selected = 0;
                break;
        }
        this.selects[name].selected = event.id;
        this.selects[name].value = event.name;
    };
    TimelogPage.prototype.onSubmit = function (form) {
        var _this = this;
        var hours = Number(this.timecount);
        if (hours < this.mintime) {
            this.nav.alert("Not enough time", true);
            return;
        }
        if (this.start_time && this.stop_time && hours > this.getInterval()) {
            this.nav.alert("Hours value should be less or equal to Start/Stop range.", true);
            return;
        }
        if (!this.selects.tasktype.selected) {
            this.nav.alert("Please, select Task Type from the list.", true);
            return;
        }
        if (form.valid) {
            if (this.time.in_progress && Date.now() - this.time.in_progress < 1500) {
                return;
            }
            this.time.in_progress = Date.now();
            var note = helpers_1.htmlEscape(this.timenote.trim()).substr(0, 5000);
            var isEdit = !!this.time.time_id;
            var time_offset = -1 * this.UserDateOffset;
            var start_time = this.start_time;
            if (this.endsWith(this.start_time, "Z"))
                start_time = start_time.substring(0, 19);
            var stop_time = this.stop_time;
            if (this.endsWith(this.stop_time, "Z"))
                stop_time = stop_time.substring(0, 19);
            var date = this.time.date;
            if (start_time) {
                date = this.AddHours(start_time, time_offset);
            }
            var data_1 = {
                "tech_id": isEdit ? this.time.user_id : this.he.user_id,
                "project_id": this.selects.project.selected,
                "is_project_log": !this.selects.ticket.selected,
                "ticket_key": this.selects.ticket.selected,
                "account_id": this.selects.account.selected,
                "note_text": note,
                "task_type_id": this.selects.tasktype.selected,
                "prepaid_pack_id": this.selects.prepaidpack.selected,
                "hours": hours,
                "no_invoice": this.isbillable,
                "date": date || "",
                "start_date": this.AddHours(start_time, time_offset) || "",
                "stop_date": this.AddHours(stop_time, time_offset) || ""
            };
            this.timeProvider.addTime(this.time.time_id, data_1, isEdit ? "PUT" : "POST").subscribe(function (res) {
                if (!_this.time.number && !_this.time.time_id && !(_this.time.account || {}).id) {
                    _this.config.setRecent({ "account": _this.selects.account,
                        "project": _this.selects.project,
                        "tasktype": _this.selects.tasktype,
                        "prepaidpack": _this.selects.prepaidpack });
                }
                if (isEdit) {
                    _this.time.start_time = data_1.start_date;
                    _this.time.stop_time = data_1.stop_date;
                    _this.time.hours = data_1.hours;
                    _this.time.no_invoice = data_1.no_invoice;
                }
                else {
                    var tdate = data_1.date || _this.AddHours(new Date(), _this.UserDateOffset);
                    var tt = {
                        time_id: 0,
                        account_id: data_1.account_id,
                        account_name: _this.selects.account.value,
                        billable: data_1.no_invoice,
                        date: tdate,
                        hours: data_1.hours,
                        is_project_log: data_1.is_project_log,
                        note: data_1.note_text,
                        project_id: data_1.project_id,
                        project_name: _this.selects.project.value,
                        start_time: data_1.start_date,
                        stop_time: data_1.stop_date,
                        time_offset: time_offset,
                        task_type: _this.selects.tasktype.value,
                        task_type_id: data_1.task_type_id,
                        prepaid_pack: _this.selects.prepaidpack.value,
                        prepaid_pack_id: data_1.prepaid_pack_id,
                        ticket_number: data_1.ticket_key,
                        ticket_subject: _this.selects.ticket.value,
                        user_email: _this.he.email,
                        user_id: _this.he.user_id,
                        user_name: _this.he.firstname + " " + _this.he.lastname
                    };
                    (_this.timeProvider._dataStore[_this.time.cachename] || []).splice(0, 0, tt);
                }
                _this.nav.alert('Time was successfully ' + (isEdit ? 'updated' : 'added') + ' :)');
                _this.close();
            }, function (error) {
                console.log(error || 'Server error');
            });
        }
    };
    TimelogPage.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    TimelogPage.prototype.setMinTime = function (date) {
        return (date || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 4);
    };
    TimelogPage.prototype.setMaxTime = function (date) {
        return (date || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 4);
    };
    TimelogPage.prototype.getStartDate = function (time) {
        return (time || this.time.date || this.AddHours(new Date(), this.UserDateOffset)).substring(0, 19);
    };
    TimelogPage.prototype.setStartDate = function (time) {
        if (time) {
            this.start_time = time.substring(0, 19);
            if (this.stop_time) {
                this.updateHours();
            }
        }
    };
    TimelogPage.prototype.setStopDate = function (time) {
        if (time) {
            this.stop_time = time.substring(0, 19);
            if (this.start_time) {
                this.updateHours();
            }
        }
    };
    TimelogPage.prototype.updateHours = function () {
        var timecount = this.getInterval();
        this.timecount = timecount.toFixed(2);
    };
    TimelogPage.prototype.endsWith = function (str, search) {
        str = str || "";
        var this_len = str.length;
        return str.substring(this_len - search.length, this_len) === search;
    };
    TimelogPage.prototype.getInterval = function () {
        var start_time = this.start_time;
        if (!this.endsWith(this.start_time, "Z"))
            start_time += "Z";
        var stop_time = this.stop_time;
        if (!this.endsWith(this.stop_time, "Z"))
            stop_time += "Z";
        return Number(Math.round((+(new Date(stop_time)) - +(new Date(start_time))) / 60000) / 60);
    };
    TimelogPage.prototype.getFixed = function (value) {
        return Number(value || "0").toFixed(2).toString();
    };
    TimelogPage.prototype.close = function () {
        this.view.dismiss();
    };
    TimelogPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/timelog/timelog.html',
            directives: [class_list_1.ClassListComponent, core_1.forwardRef(function () { return select_list_1.SelectListComponent; })],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, time_provider_1.TimeProvider, ionic_angular_1.Config, ionic_angular_1.ViewController])
    ], TimelogPage);
    return TimelogPage;
}());
exports.TimelogPage = TimelogPage;
