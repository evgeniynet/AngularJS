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
var pipes_1 = require("../../pipes/pipes");
var PostsListComponent = (function () {
    function PostsListComponent(config) {
        this.config = config;
        this.posts = [];
        this._posts = [];
        this.attachments = [];
    }
    PostsListComponent.prototype.filter = function () {
        var posts = [];
        if (!this.is_showlogs)
            posts = this.posts.filter(function (item) { return !!~["Initial Post", "Response", "Closed", "ReOpened"].indexOf(item.log_type); });
        else
            posts = this.posts;
        this._posts = this.is_first ? [posts[0]] : posts.slice(1);
    };
    PostsListComponent.prototype.ngOnInit = function () {
        this.filter();
    };
    PostsListComponent.prototype.ngOnChanges = function (event) {
        if ("is_showlogs" in event) {
            this.filter();
            return;
        }
        if ("posts" in event) {
            if ("posts" in event && (event.posts.isFirstChange() || (event.posts.currentValue[0] || {}).id == (event.posts.previousValue[0] || {}).id))
                return;
            this.filter();
        }
    };
    PostsListComponent.prototype.getTime = function (date) {
        var hours = this.config.getCurrent("timezone_offset");
        console.log(hours);
        if (date) {
            if (date.length == 19)
                date = date.slice(0, -3);
            console.log(date);
            var temp = new Date(date);
            console.log(temp);
            return new Date(temp.setTime(temp.getTime() + (hours * 60 * 60 * 1000))).toJSON();
        }
        return date;
    };
    PostsListComponent.prototype.setDate = function (date, showmonth, istime) {
        return date ? helpers_1.getDateTime(date, showmonth, istime) : null;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], PostsListComponent.prototype, "posts", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], PostsListComponent.prototype, "attachments", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], PostsListComponent.prototype, "is_showlogs", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], PostsListComponent.prototype, "is_first", void 0);
    PostsListComponent = __decorate([
        core_1.Component({
            selector: 'posts-list',
            templateUrl: 'build/components/posts-list/posts-list.html',
            directives: [ionic_angular_1.IONIC_DIRECTIVES],
            pipes: [pipes_1.LinebreaksPipe, pipes_1.GravatarPipe, pipes_1.DaysoldPipe, pipes_1.FilesPipe],
        }),
        __metadata("design:paramtypes", [ionic_angular_1.Config])
    ], PostsListComponent);
    return PostsListComponent;
}());
exports.PostsListComponent = PostsListComponent;
