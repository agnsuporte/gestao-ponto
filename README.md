# App de Controle de Ponto

## 1. Visão Geral

Este aplicativo tem como objetivo permitir o **registro de ponto diário** de forma simples, intuitiva e conforme as **regras gerais da legislação laboral portuguesa**. O sistema foi desenhado para registrar turnos de trabalho, calcular horas trabalhadas e identificar horas extras.

O foco inicial é uso individual, com arquitetura preparada para futura expansão (multiusuário, multiempresa).

---

## 2. Stack Tecnológica

### Frontend

* **Next.js (App Router)**
* **React Server Components**
* **shadcn/ui**
* **TailwindCSS**
* **Lucide Icons**

### Backend

* **Next.js Server Actions / API Routes**
* **Prisma ORM**
* **PostgreSQL**

---

## 3. Funcionalidades

* Registro de ponto com três períodos:

  * Turno 1 (entrada / saída)
  * Almoço (entrada / saída)
  * Turno 2 (entrada / saída)
* Botão inteligente de entrada/saída por período
* Visualização do histórico diário
* Cálculo automático de:

  * Horas trabalhadas
  * Horas extras
* Interface limpa, minimalista e responsiva

---

## 4. Regras de Negócio

### Jornada de Trabalho

* Jornada padrão: **8 horas diárias (480 minutos)**
* O período de almoço **não é contabilizado** como tempo de trabalho

### Cálculo de Horas

1. Soma-se o tempo do Turno 1 e Turno 2
2. Caso o total ultrapasse 8 horas, o excedente é considerado **hora extra**

> Observação: nesta versão não há aplicação de coeficientes legais (50%, 75%, etc.)

---

## 5. Modelagem de Dados

### Entidade: TimeRecord

Cada usuário possui **um registro por dia**.

Campos principais:

* Identificação do usuário
* Data do registro
* Horários de entrada e saída de cada período
* Total trabalhado (em minutos)
* Horas extras (em minutos)

Todos os cálculos são realizados no backend para garantir consistência.

---

## 6. Fluxo de Uso

1. Usuário acessa a página principal
2. Visualiza a data atual e os cartões de turno
3. Clica no botão do período desejado:

   * Primeiro clique: registra entrada
   * Segundo clique: registra saída
4. O sistema atualiza automaticamente o resumo do dia

---

## 7. Interface e Design

### Paleta de Cores

* Azul profundo: `#1e3a5f`
* Verde água (ações): `#10b981`

### Estilo

* Visual minimalista
* Cards com sombras suaves
* Bordas arredondadas
* Animações sutis de interação

---

## 8. Estrutura do Projeto

```
app/
 ├─ page.tsx            # Dashboard principal
 ├─ actions/            # Server Actions
 ├─ components/         # Componentes reutilizáveis
 ├─ lib/                # Lógica de negócio e utilidades
 └─ docs/               # Documentação
```

---

## 9. Evoluções Futuras

* Banco de horas
* Relatórios semanais e mensais
* Exportação PDF / Excel
* Multiusuário e multiempresa
* Controle por geolocalização
* Auditoria e logs

---

## 10. Observações Finais

Este projeto prioriza clareza, rastreabilidade e aderência às regras gerais de jornada de trabalho em Portugal, mantendo flexibilidade para adaptações futuras.
