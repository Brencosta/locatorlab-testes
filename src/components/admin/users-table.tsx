import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminUser } from "@/lib/admin";
import { ROLE_LABELS } from "@/lib/task-labels";
import { formatDate } from "@/lib/utils";

/** Lista de usuários cadastrados (somente leitura). */
export function UsersTable({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  return (
    <Card data-testid="admin-users-card">
      <CardHeader>
        <CardTitle>
          <h2>Usuários cadastrados</h2>
        </CardTitle>
        <CardDescription data-testid="admin-users-count" data-total={users.length}>
          {users.length === 1 ? "1 usuário" : `${users.length} usuários`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table aria-label="Usuários cadastrados" data-testid="admin-users-table">
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="text-right">Tarefas</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  data-testid={`admin-user-row-${user.id}`}
                  data-role={user.role}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        name={user.name}
                        avatarUrl={
                          user.hasAvatar ? `/api/v1/avatars/${user.id}` : null
                        }
                        className="size-7 text-xs"
                        testId={`admin-user-avatar-${user.id}`}
                      />
                      <span className="font-medium" data-testid={`admin-user-name-${user.id}`}>
                        {user.name}
                      </span>
                      {user.id === currentUserId ? (
                        <Badge variant="outline" className="text-muted-foreground">
                          Você
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell data-testid={`admin-user-email-${user.id}`}>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "secondary"}
                      data-testid={`admin-user-role-${user.id}`}
                    >
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="text-right tabular-nums"
                    data-testid={`admin-user-tasks-${user.id}`}
                  >
                    {user.taskCount}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
