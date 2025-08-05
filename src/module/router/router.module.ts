import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AdminRouterModule } from './routes/adminRouter.module';
import { UserRouterModule } from './routes/userRouter.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'users',
        module: UserRouterModule,
      },
      {
        path: 'admin',
        module: AdminRouterModule,
      },
    ]),
  ],
})
export class AppRoutingModule {}
