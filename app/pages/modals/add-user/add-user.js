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
var data_provider_1 = require("../../../providers/data-provider");
var AddUserModal = (function () {
    function AddUserModal(nav, navParams, dataProvider, config, viewCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.dataProvider = dataProvider;
        this.config = config;
        this.viewCtrl = viewCtrl;
        this.firstname_m = "";
        nav.swipeBackEnabled = false;
    }
    AddUserModal.prototype.ngOnInit = function () {
        this.ispassword = true;
        this.data = (this.navParams.data || {}).type || {};
        this.firstname_m = (this.navParams.data || {}).name || " ";
    };
    AddUserModal.prototype.ngAfterViewInit = function () {
        setTimeout(function () { var s = document.getElementsByTagName("ion-page")[0]; s.style.display = 'none'; s.offsetHeight; s.style.display = ''; }, 200);
        this.firstname_m = this.firstname_m.trim();
    };
    AddUserModal.prototype.dismissPage = function (data) {
        this.viewCtrl.dismiss(data);
    };
    AddUserModal.prototype.onSubmit = function (form) {
        var _this = this;
        if (form.valid) {
            this.dataProvider.addUser(form.value.email, form.value.firstname, form.value.lastname, this.data.type).subscribe(function (data) {
                _this.nav.alert(_this.data.charAt(0).toUpperCase() + _this.data.slice(1) + ' was created :)');
                setTimeout(function () {
                    _this.dismissPage(data);
                }, 1000);
            }, function (error) {
                _this.nav.alert(form.value.email + ' already exists! Please try again', true);
                console.log(error || 'Server error');
            });
        }
    };
    AddUserModal = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/modals/add-user/add-user.html',
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Nav, ionic_angular_1.NavParams, data_provider_1.DataProvider, ionic_angular_1.Config,
            ionic_angular_1.ViewController])
    ], AddUserModal);
    return AddUserModal;
}());
exports.AddUserModal = AddUserModal;
