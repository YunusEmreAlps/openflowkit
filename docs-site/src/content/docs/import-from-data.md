---
draft: false
title: Import from Structured Data
---

The **Import** tab in the Studio panel converts structured text — SQL schemas, infrastructure-as-code, and API specs — directly into editable diagrams. No manual drawing required.

## How it works

Paste your source text, select the type, hit **Generate Diagram**. FlowPilot analyzes the content, builds a prompt internally, and returns a fully laid-out diagram on the canvas.

The pipeline is identical to the chat-based AI generation:

```
Your text → specialized prompt → AI model → DSL → ELK layout → canvas
```

All your existing AI provider and API key settings apply.

## SQL DDL → Entity-Relationship Diagram

Paste one or more `CREATE TABLE` statements to generate an ER diagram.

FlowPilot will:
- Create one node per table
- List primary keys, foreign keys, and key columns inside each node
- Draw edges between tables that share foreign key relationships, labelled with the FK column and cardinality (e.g. `1:N`)
- Group related tables into sections (e.g. "User Domain", "Order Domain")

**Example input:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total NUMERIC(10,2),
  status TEXT DEFAULT 'pending'
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT,
  quantity INT
);
```

## Terraform / K8s → Cloud Architecture

Paste infrastructure-as-code to generate a cloud architecture diagram. Supports three formats — select the one matching your input:

| Format | What it handles |
| --- | --- |
| **Terraform / HCL** | `.tf` files, resource blocks, `depends_on` |
| **Kubernetes YAML** | Deployments, Services, Ingress, ConfigMaps |
| **Docker Compose** | Services, networks, volumes, depends_on |

FlowPilot maps each resource to a node, groups by VPC / namespace / environment, and draws edges for traffic flow and dependencies.

**Example input (Terraform):**

```hcl
resource "aws_vpc" "main" { cidr_block = "10.0.0.0/16" }

resource "aws_instance" "api" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.medium"
}

resource "aws_db_instance" "postgres" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
}
```

## OpenAPI / Swagger → Sequence Diagram

Paste a YAML or JSON OpenAPI spec to generate an API sequence flow.

FlowPilot will:
- Create actor nodes for Client, API Gateway, and service groups
- Show the request/response flow for major endpoint groups
- Label edges with HTTP method + path and response status codes
- Surface authentication flows where security schemes are defined

**Example input:**

```yaml
openapi: 3.0.0
info:
  title: Orders API
paths:
  /auth/token:
    post:
      summary: Authenticate
  /orders:
    get:
      summary: List orders
      security:
        - bearerAuth: []
    post:
      summary: Create order
      security:
        - bearerAuth: []
```

## Tips

- **Partial input is fine.** You don't need a complete schema or spec — paste the relevant sections and FlowPilot will work with what's there.
- **Iterate with chat.** After the initial import, switch to the FlowPilot chat tab to refine: "add a Redis cache between the API and the database", "group the auth tables into their own section".
- **Large inputs.** Very large files (> ~4,000 lines) may exceed model context. Paste the core tables or services and add detail incrementally.

## Related reading

- [AI Generation](/ai-generation/)
- [Prompting FlowPilot](/prompting-agents/)
- [OpenFlow DSL](/openflow-dsl/)
