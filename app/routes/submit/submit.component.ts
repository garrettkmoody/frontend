import {Component, NgModule} from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';

import { RequestService } from "../../RequestService/requests";


@Component({
	selector: 'submit',
	templateUrl: 'app/routes/submit/submit.component.html',
	providers: [ RequestService ]
})

export class SubmitComponent {
	form: any;
	gForm: any;
	app: any;
	gApp: any;
	answers: any[] = [];
	gAnswers:any[] = [];
	formID: number;
	currentUser: any;

	constructor(private route: ActivatedRoute, private rs: RequestService, private router: Router) {
		this.formID = route.snapshot.params['formID'];	
		rs.verify((user) => {
			if(user) {
				this.currentUser = user;
				console.log(this.currentUser);

				rs.get('/forms/job/view/1', (data) => {
					this.gForm = data.form//{ formID: "1", name: "generic", img: "http://lorempixel.com/300/200/abstract/", desc: "baseline stuff", owner: "1", questions: [{ID: "1", text: "What does ASWWU mean to you?"}]};
					//GET request to retrieve previous application answers
					rs.get('/forms/application/view/1/'+this.currentUser.username, (data) => {
						console.log("hey");
						this.gApp = data.application//{ jobID: "1", answers: [ {questionID: "1", answer: "many things"}], username: "buddy.boy", status: "", last_update: ""};
						if(!this.gApp) {
							//build the empty answers array
							this.gForm.questions.forEach((entry) => {
								let answerObj = {questionID: entry.ID, answer: ""};
								this.gAnswers.push(answerObj);
							});
						} else {
							this.gApp.answers.forEach((entry) => {
								let answerObj = {questionID: entry.questionID, answer: entry.answer};
								this.gAnswers.push(answerObj);
							});
						}
					}, (err) => {
						this.gForm.questions.forEach((entry) => {
							let answerObj = {questionID: entry.id, answer: ""};
							this.gAnswers.push(answerObj);
						});
					});
				}, undefined);

				//GET request to retrieve the form
				rs.get('/forms/job/view/'+this.formID, (data) => {
					this.form = data.form//{ formID: "2", name: "dog whisperer", img: "http://lorempixel.com/300/200/abstract/", desc: "talk to dogs", owner: "1", questions: [{ID: "1", text: "What's your favorite color?"}, {ID: "2", text: "What's the best animal?"}]};
					//GET request to retrieve previous application answers
					rs.get('/forms/application/view/'+this.formID+'/'+this.currentUser.username, (data) => {
						this.app = data.application//{ jobID: "2", answers: [ {questionID: "1", answer: "Roja"}, {questionID: "2", answer: "Dogs of course"}], username: "buddy.boy", status: "", last_update: ""};
						if(!this.app) {
							//build the empty answers array
							this.form.questions.forEach((entry) => {
								let answerObj = {questionID: entry.ID, answer: ""};
								this.answers.push(answerObj);
							});
						} else {
							this.app.answers.forEach((entry) => {
								let answerObj = {questionID: entry.questionID, answer: entry.answer};
								this.answers.push(answerObj);
							});
						}
					}, (err) => {
						this.form.questions.forEach((entry) => {
							let answerObj = {questionID: entry.id, answer: ""};
							this.answers.push(answerObj);
						});
					});
				}, undefined);
			}
		});
	}

	onSubmit() {
		let submission = { jobID: this.formID, username: this.currentUser.username, answers: this.answers};
		let gSubmission = { jobID: "1", username: this.currentUser.username, answers: this.gAnswers};
		this.rs.postxwww('/forms/application/submit', gSubmission, (data) => {
			try {
				if(!data.error) {
					this.rs.postxwww('/forms/application/submit', submission, (data) => {
						try {
							if(data.error) {
								window.alert("Error: "+data.error);
							} else if(data.status == "submitted") {
								this.router.navigateByUrl("/done/"+this.formID);
							} else {
								window.alert("form status: "+data.status);
							}
						}
						catch(err) {
							window.alert(err);
						}
					}, (error) => { window.alert(error)} );
				}
			}
			catch(err) {
				
			}
		}, (error) => { window.alert(error)} );
	}

}