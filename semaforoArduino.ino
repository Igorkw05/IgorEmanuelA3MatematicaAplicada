
bool emergencia = false; //modo emergencia

void setup()
{
  Serial.begin(9600);
  
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(7, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(1, OUTPUT);
  pinMode(0, OUTPUT);
  
}

void loop()
{
  // ver se existe algum imput
  if (Serial.available() > 0) {
 
    char incomingByte = Serial.read(); 
    
    // se imput existir e for "E" modo emergencia = verdadeiro
    if (incomingByte == 'E') {
      emergencia = true;
    }
  }
	// se emergencia = verdadeiro, piscar LED amarelo
  if (emergencia) {
	for (int i = 0; i < 6; i++) {
    digitalWrite(9, HIGH);
    delay(500);
    digitalWrite(9, LOW);
    delay(500);
  }
    // retornar emergencia para falso para continuar o loop
    emergencia = false; 
    return; 
  }


  digitalWrite(13, HIGH); // Semaforo A ligado
  delay(3000); 
  digitalWrite(13, LOW);
  delay(1000);

  digitalWrite(12, HIGH); // Semaforo A ligado
  delay(1000);
  digitalWrite(12, LOW);
  delay(1000);

  digitalWrite(11, HIGH); // Semaforo A desligado
  delay(1000);
  digitalWrite(11, LOW);
  delay(1000);
  
  digitalWrite(7, HIGH); // Semaforo B ligado
  delay(1000);
  digitalWrite(7, LOW);
  delay(1000);

  digitalWrite(6, HIGH); // Semaforo B ligado
  delay(1000);
  digitalWrite(6, LOW);
  delay(1000);
  
  digitalWrite(5, HIGH); // Semaforo B desligado
  delay(1000);
  digitalWrite(5, LOW);
  delay(1000);
  
  digitalWrite(8, HIGH); // Pedestres podem passar
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);
  

  
}
