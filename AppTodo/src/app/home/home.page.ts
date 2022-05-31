import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tarefas: any[] = [];
  // todoService: any;
  
  

  constructor(
    private toastCtrl: ToastController, 
    private actionSheetCrtl: ActionSheetController,
    private todoService: TodoService,
    private alertCrtl: AlertController) {
    let tarefaSalva = localStorage.getItem('tarefaUsuario');

      if (tarefaSalva != null) {
        this.tarefas = JSON.parse(tarefaSalva);
      }
  }
  carregaTarefa(){
    this.todoService.listaTarefa()
    .then( async(resposta: any[])=>{
      console.table(resposta);
      this.tarefas = resposta;
    })
    .catch(async(erro)=>{
      const toast = await this.toastCtrl.create({
        message: 'Erro ao realizar operação!',
        duration: 2000,
        position: 'top'
      });
      toast.present();  });
  }
async showAdd(){
  const alert = await this.alertCrtl.create({
    cssClass: 'my-custom-class',
    header: 'O que você deseja fazer?',
    inputs: [
      {
        name: 'tarefa1',
        type: 'text',
        placeholder: 'Digite o que deseja fazer.',
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secundary',
        handler: () => {
          console.log('Cancelado com sucesso!');
        },
      },
      {
        text: 'Adicionar',
        handler: (form) => {
          this.adicionaTarefa(form.tarefa1);
        },
      },
    ],
  });
  await alert.present();
}
async adicionaTarefa(novaTarefa: string, ) {
 if (novaTarefa.trim().length < 1) {
  const toast = await this.toastCtrl.create({
    message: 'Por favor, digite a tarefa!',
    duration: 2000,
    position: 'top',
  });
toast.present();
return;
 } 
 const tarefa = { nome:novaTarefa, realizada: 0 };
this.tarefas.push(tarefa);
this.todoService.adicionaTarefa(tarefa.nome)
.then( async(resposta)=> {
  const toast = await this.toastCtrl.create({
    message: 'Operação Realizada com Sucesso!',
    duration: 2000,
    position: 'top'
  });
  toast.present();
}).catch(async(erro)=>{
  const toast = await this.toastCtrl.create({
    message: 'Erro ao realizar operação!',
    duration: 2000,
    position: 'top'
  });
  toast.present();  });
}
salvaLocalStorage(){
  localStorage.setItem('tarefaUsuario', JSON.stringify(this.tarefas));
}
async realizaAcoes(tarefa: any) {
  const actionSheet = await this.actionSheetCrtl.create({
    header: 'Qual ação reaizar?',
    buttons: [{
      text: tarefa.realizada ? 'Desmarcar' : 'Marcar',
      icon: tarefa.realizada ? 'checkmark-circle' : 'radio-button-off-outline',
      handler: () => {
        tarefa.realizada = !tarefa.realizada;
        this.salvaLocalStorage();
      }
    }, {
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }]
  });
  await actionSheet.present();

  const { role, data } = await actionSheet.onDidDismiss();
}
excluirTarefa(tarefa: any){
  this.tarefas = this.tarefas.filter(arrayTarefa => tarefa != arrayTarefa);

  this.salvaLocalStorage();
}
}
function resposta(resposta: any): any {
  throw new Error('Function not implemented.');
}

function carregaTarefa() {
  throw new Error('Function not implemented.');
}

