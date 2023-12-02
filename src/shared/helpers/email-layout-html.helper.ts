import { MakeDateProvider } from "@shared/providers";
import { currencyToBRL } from "./currency-to-brl.helper";

type Tranche = {
    amount: number;
    status: string;
    dueDate: Date
    trancheNumber: number
}

type TemplateParameters = {
    [paramName: string]: string | string[];
};


const INVOICE_FIX_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            font-weight: 400;
            text-align: left;
            background-color: #f0f0f0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
        }
        .logo img {
            max-width: 100%;
            border: none;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            margin: 15px 0;
        }
        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        li {
            font-size: 14px;
            margin: 10px 0; /* Adicionado espaçamento superior e inferior para cada lista */
            padding-left: 20px; /* Adicionada indentação */
            position: relative;
        }
        strong {
            font-weight: bold;
        }
        .flow-banco {
            font-weight: bold;
        }
        .greeting {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="https://www.flowbanco.com.br/img/logo-flowbanco-horizontal.svg" alt="Logo Flow Banco">
        </div>

        <p class="greeting">Olá, <strong>{{name}}</strong></p>
        <p>Por gentileza, enviar uma carta de correção referente a <strong>Nota Fiscal Nº {{numero_nf}}</strong> e <strong>Chave NF {{chave_nf}}</strong> com os seguintes ajustes:</p>
        <ul>
           {{tranches}}
        </ul>
        <p>Após realizar o ajuste, basta acessar seu internet banking, clicar no banner e na opção "Antecipação a fornecedor" clicar na nota fiscal referente à correção e incluir o arquivo XML da correção.</p>
        <p>Ficamos no aguardo.</p>
        <p>Atenciosamente,<br><span class="flow-banco">FlowBanco</span></p>
    </div>
</body>
</html>
`
function replaceParameters(template: string, parameters: TemplateParameters): string {
    let result = template;
    for (const paramName in parameters) {
        if (parameters.hasOwnProperty(paramName)) {
            const paramValue = parameters[paramName];
            const pattern = new RegExp(`{{${paramName}}}`, 'g');

            if (Array.isArray(paramValue)) {
                const combinedValue = paramValue.join('');
                result = result.replace(pattern, combinedValue);
            } else {
                result = result.replace(pattern, paramValue);
            }
        }
    }
    return result;
}

export function getInvoiceFixRequestTemplate(tranches: Tranche[], clientName: string, numeroNf: string, chaveNf: string): string {
    const dateProvide = MakeDateProvider.getProvider();
    const tags = tranches.map((t) => {
        return `
        <li><strong>Parcela ${t.trancheNumber}:</strong></li>
        <ul style="padding-left: 20px;">
            <li>Data de Vencimento: ${dateProvide.maskDate({
            date: new Date(t.dueDate),
            mask: 'dd/MM/yyyy',
        })}</li>
            <li>Valor: ${currencyToBRL(t.amount)}</li>
        </ul>`;
    });

    const parameters: TemplateParameters = {
        name: clientName,
        tranches: tags,
        numero_nf: numeroNf,
        chave_nf: chaveNf
    };

    return replaceParameters(INVOICE_FIX_REQUEST_TEMPLATE, parameters)
}