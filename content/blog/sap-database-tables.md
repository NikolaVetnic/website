---
title: SAP Database Tables
date: 2022-11-21
summary: "There exist three types of SAP database tables: transparent tables, pool tables and cluster tables."
tags: [sap]
---

There exist three types of SAP database tables: transparent tables, pool tables and cluster tables.

## Transparent tables

Transparent tables are of the same structure both in dictionary as well as in the database itself, i.e. they both contain exactly the same fields and data. For that reason, one table in the data dictionary corresponds with exactly one table in the database (i.e. it is a one-to-one relationship).

These tables have at least one primary key, secondary indices can be created and they can be accessed both from within SAP ecosystem (using Open SQL) as well as outside of it using the database’s native SQL. They can be buffered, although that should be avoided in case of heavily updated tables.

Transparent tables are used to store master data, e.g. table of customers or a table of vendors. Examples of such tables are BKPF, VBAK, VBAP, KNA1, COEP, etc.

## Pool Tables

Pool tables are logical tables that must be assigned to a table pool upon defining them, meaning that many tables appearing as distinct in ABAP dictionary are actually stored as one physical table within the database. This equates to a many-to-one relationship with the actual database table.

The table in the database has a different name than the tables in the DDIC, it has a different number of fields, and the fields have different names as well. Pooled tables are thus an SAP proprietary construct used to hold a large number (tens to thousands) of very small tables (about 10 to 100 rows each) in one specially constructed physical database table.

Pooled tables are primarily used by SAP to hold customizing data. Examples of SAP standard pooled tables include M\_MTVMA, M\_MTVMB, M\_MTVMC, M\_MTVMD, M\_MTVME, M\_MTVNF, M\_MTVNG, M\_MTVNH, M\_MTVNI, M\_MTVNJ, etc.

## Cluster Tables

A cluster table is similar to a pooled table in the sense that it holds many tables within, but in this case those are cluster tables. It has a many-to-one relationship with a physical table in the database.

Cluster tables contain continuous text, for example, documentation. Several cluster tables can be combined to form a table cluster. Several logical lines of different tables are combined to form a physical record in this table type. This permits object-by-object storage or object-by-object access. In order to combine tables in clusters, at least parts of the keys must agree. Several cluster tables are stored in one corresponding table on the database.

Like pooled tables, cluster tables are another proprietary SAP construct. They are used to hold data from a few (approximately 2 to 10) very large tables. They would be used when these tables have a part of their primary keys in common, and if the data in these tables are all accessed simultaneously. Table clusters contain fewer tables than table pools and, unlike table pools, the primary key of each table within the table cluster begins with the same field or fields. Rows from the cluster tables are combined into a single row in the table cluster. The rows are combined based on the part of the primary key they have in common. Thus, when a row is read from any one of the tables in the cluster, all related rows in all cluster tables are also retrieved, but only a single I/O is needed.

A cluster is advantageous in the case where data is accessed from multiple tables simultaneously and those tables have at least one of their primary key fields in common. Cluster tables reduce the number of database reads and thereby improve performance.

Examples of cluster tables include BSEC (one-time account data document), BSED (bill of exchange fields document), BSEG (accounting document), BSES (document control data), BSET (tax data document), AUAA (settlement document – receiver), AUAB (settlement document – distribution), etc.

## Restrictions on Pooled and Cluster Tables

Pooled and cluster tables are usually used only by SAP and not used by customers, probably because of the proprietary format of these tables within the database and because of technical restrictions placed upon their use within ABAP/4 programs. Restrictions on pooled and cluster tables include:

- secondary indexes cannot be created
- you cannot use the ABAP/4 constructs select distinct or group by
- you cannot use native SQL
- you cannot specify field names after the order by clause. order by primary key is the only permitted variation
