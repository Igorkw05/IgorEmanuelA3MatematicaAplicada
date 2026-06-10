// projeto A3 - semaforo inteligente
// Igor e Emanuel - UNICURITIBA
// ultima atualização: implementamos o ciclo automatico finalmente

let tempo = 5;
let intervalo = null;
let ciclando = true; // vira false só na emergencia
let faseCiclo = 0;   // 0=via A, 1=via B, 2=pedestre

// quanto tempo cada fase dura (em segundos)
const DURACAO = [3, 3, 10]; // viaA, viaB, pedestre

// limpa todas as luzes antes de mudar de estado
function limparLuzes() {
  document.querySelectorAll(".luz, .icone-pedestre").forEach((item) => {
    item.classList.remove("ativo");
    item.classList.remove("piscando");
  });
}

// essa função deu muito trabalho pra sincronizar as animações
// se mexer quebra tudo, não toque
function limparAnimacoes() {
  const carroA = document.getElementById("carro-a");
  const carroB = document.getElementById("carro-b");
  const pedestre = document.getElementById("pedestre");
  const carroA2 = document.getElementById("carro-a2");
  const carroB2 = document.getElementById("carro-b2");
  const pedestre2 = document.getElementById("pedestre2");

  carroA.classList.remove("mover-via-a");
  carroB.classList.remove("mover-via-b");
  pedestre.classList.remove("mover-pedestre");
  carroA2.classList.remove("mover-via-a2");
  carroB2.classList.remove("mover-via-b2");
  pedestre2.classList.remove("mover-pedestre2");

  // isso aqui força o browser a reiniciar a animação (descobri no stackoverflow)
  void carroA.offsetWidth;
  void carroB.offsetWidth;
  void pedestre.offsetWidth;
  void carroA2.offsetWidth;
  void carroB2.offsetWidth;
  void pedestre2.offsetWidth;
}

function animar(id, classe) {
  limparAnimacoes();
  document.getElementById(id).classList.add(classe);
}

// avança pro proximo estado do ciclo automaticamente
// ordem: via A -> via B -> pedestre -> via A -> ...
function proximaFase() {
  faseCiclo = (faseCiclo + 1) % 3;

  if (faseCiclo === 0) liberarViaA();
  else if (faseCiclo === 1) liberarViaB();
  else liberarPedestre();
}

function atualizarTempo(valor) {
  tempo = valor;
  document.getElementById("tempo").textContent = tempo;
  clearInterval(intervalo);

  intervalo = setInterval(() => {
    if (tempo > 0) {
      tempo--;
      document.getElementById("tempo").textContent = tempo;
    } else {
      clearInterval(intervalo);
      // agora implementado! muda de estado sozinho quando o tempo acaba
      if (ciclando) proximaFase();
    }
  }, 1000);
}

function adicionarHistorico(texto) {
  const historico = document.getElementById("historico");
  const item = document.createElement("li");
  const hora = new Date().toLocaleTimeString("pt-BR");
  item.textContent = hora + " - " + texto;
  historico.prepend(item);
}

// função genérica pra setar qualquer estado
// criamos isso pra não repetir código em cada botão
function definirEstado(config) {
  limparLuzes();

  config.luzes.forEach((id) => {
    document.getElementById(id).classList.add("ativo");
  });

  document.getElementById("status-a").textContent = config.statusA;
  document.getElementById("status-b").textContent = config.statusB;
  document.getElementById("status-p").textContent = config.statusP;
  document.getElementById("estado-atual").textContent = config.estado;
  document.getElementById("binario").textContent = config.binario;

  atualizarTempo(config.tempo);
  adicionarHistorico(config.estado);

  console.log("estado mudou para:", config.estado, "| binario:", config.binario);
}

// S0 - via A verde, B vermelha
function liberarViaA() {
  faseCiclo = 0;
  ciclando = true;

  definirEstado({
    estado: "Via A liberada",
    statusA: "Verde",
    statusB: "Vermelho",
    statusP: "Aguarde",
    binario: "10000001",
    tempo: DURACAO[0],
    luzes: ["a-verde", "b-vermelho", "p-vermelho"]
  });

  animar("carro-a", "mover-via-a");
  // segundo carro também se move junto
  document.getElementById("carro-a2").classList.add("mover-via-a2");
}

// S1 - via B verde, A vermelha
function liberarViaB() {
  faseCiclo = 1;
  ciclando = true;

  definirEstado({
    estado: "Via B liberada",
    statusA: "Vermelho",
    statusB: "Verde",
    statusP: "Aguarde",
    binario: "00110010",
    tempo: DURACAO[1],
    luzes: ["a-vermelho", "b-verde", "p-vermelho"]
  });

  animar("carro-b", "mover-via-b");
  document.getElementById("carro-b2").classList.add("mover-via-b2");
}

// S2 - pedestre atravessa, carros param
function liberarPedestre() {
  faseCiclo = 2;
  ciclando = true;

  definirEstado({
    estado: "Pedestre ativo",
    statusA: "Vermelho",
    statusB: "Vermelho",
    statusP: "Pode atravessar",
    binario: "00100111",
    tempo: DURACAO[2], // deixamos 5s mas na vida real seria uns 15s
    luzes: ["a-vermelho", "b-vermelho", "p-verde"]
  });

  animar("pedestre", "mover-pedestre");
  document.getElementById("pedestre2").classList.add("mover-pedestre2");
}

// S3 - emergencia, para tudo e fica piscando amarelo
// feito separado do definirEstado pq nao tem contagem regressiva
function modoEmergencia() {
  ciclando = false;
  clearInterval(intervalo); // para o ciclo automatico

  limparLuzes();
  limparAnimacoes();

  ["a-amarelo", "b-amarelo", "p-vermelho"].forEach((id) => {
    document.getElementById(id).classList.add("ativo");
  });

  document.getElementById("status-a").textContent = "Amarelo piscando";
  document.getElementById("status-b").textContent = "Amarelo piscando";
  document.getElementById("status-p").textContent = "Aguarde";
  document.getElementById("estado-atual").textContent = "Modo emergência";
  document.getElementById("binario").textContent = "01001000";
  document.getElementById("tempo").textContent = "--"; // sem contagem na emergencia

  document.getElementById("a-amarelo").classList.add("piscando");
  document.getElementById("b-amarelo").classList.add("piscando");

  adicionarHistorico("Modo emergência");
  console.log("estado mudou para: Modo emergência | binario: 01001000");
}

function resetarSistema() {
  console.log("resetando...");
  faseCiclo = 0;
  ciclando = true;
  liberarViaA();
}

// inicia no estado padrão (via A liberada) e o ciclo começa sozinho
window.onload = function () {
  liberarViaA();
};
