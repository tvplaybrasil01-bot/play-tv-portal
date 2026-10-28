export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = "https://play-tv-portal.pages.dev";
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin === allowed ? origin : allowed,
      "Vary": "Origin",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });

    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/") return json({ sistema: "PLAY TV GESTOR API", status: "online" });
    if (!env.DB || !env.ADMIN_PASSWORD) return json({ erro: "Banco DB ou senha não configurados." }, 500);

    if (request.method === "GET" && path === "/public-config") {
      try {
        const result = await env.DB.prepare("SELECT chave, valor FROM site_config ORDER BY chave").all();
        const configuracoes = {};
        for (const item of result.results) configuracoes[item.chave] = item.valor;
        return json({ configuracoes });
      } catch {
        return json({ erro: "Não foi possível carregar as configurações." }, 500);
      }
    }

    const auth = request.headers.get("Authorization") || "";
    if (auth !== `Bearer ${env.ADMIN_PASSWORD}`) return json({ erro: "Acesso não autorizado." }, 401);

    try {
      if (request.method === "GET" && path === "/site-config") {
        const result = await env.DB.prepare("SELECT chave, valor FROM site_config ORDER BY chave").all();
        const configuracoes = {};
        for (const item of result.results) configuracoes[item.chave] = item.valor;
        return json({ configuracoes });
      }

      if (request.method === "PUT" && path === "/site-config") {
        const data = await request.json();
        if (!data || typeof data !== "object" || Array.isArray(data) || Object.keys(data).length > 100) {
          return json({ erro: "Configurações inválidas." }, 400);
        }
        const statements = [];
        for (const [chave, valor] of Object.entries(data)) {
          if (!/^[a-zA-Z0-9_-]{1,100}$/.test(chave) ||
              !["string", "number", "boolean"].includes(typeof valor)) {
            return json({ erro: "Chave ou valor inválido." }, 400);
          }
          statements.push(env.DB.prepare(
            `INSERT INTO site_config (chave, valor, atualizado_em)
             VALUES (?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(chave) DO UPDATE SET
             valor = excluded.valor, atualizado_em = CURRENT_TIMESTAMP`
          ).bind(chave, String(valor)));
        }
        if (statements.length) await env.DB.batch(statements);
        return json({ mensagem: "Configurações salvas." });
      }

      if (request.method === "GET" && path === "/clientes") {
        const result = await env.DB.prepare(
          `SELECT id, nome, whatsapp, plano, valor, vencimento, forma_pagamento,
           observacoes, status, criado_em FROM clientes ORDER BY id DESC LIMIT 500`
        ).all();
        return json({ clientes: result.results });
      }

      if (request.method === "POST" && path === "/clientes") {
        const data = await request.json();
        const nome = String(data.nome || "").trim();
        const whatsapp = String(data.whatsapp || "").trim();
        const plano = String(data.plano || "").trim();
        const vencimento = String(data.vencimento || "").trim();
        const valor = Number(data.valor);
        if (!nome || !whatsapp || !plano || !vencimento || !Number.isFinite(valor) || valor < 0) {
          return json({ erro: "Preencha nome, WhatsApp, plano, valor e vencimento." }, 400);
        }
        const result = await env.DB.prepare(
          `INSERT INTO clientes (nome, whatsapp, plano, valor, vencimento, forma_pagamento, observacoes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(nome, whatsapp, plano, valor, vencimento,
          String(data.forma_pagamento || ""), String(data.observacoes || "")).run();
        return json({ mensagem: "Cliente cadastrado.", id: result.meta.last_row_id }, 201);
      }
      return json({ erro: "Rota não encontrada." }, 404);
    } catch {
      return json({ erro: "Erro ao processar solicitação." }, 500);
    }
  }
};
