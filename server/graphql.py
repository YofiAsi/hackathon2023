import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from .models import Event, User

class EventObject(SQLAlchemyObjectType):
    class Meta:
        model = Event
        # only_fields = ("name",)
        # exclude_fields = ("last_name",)
        # interfaces = (graphene.relay.Node,)

class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = User
        # interfaces = (graphene.relay.Node,)

# class Query(graphene.ObjectType):
#     node = graphene.relay.Node.Field()
#     all_events = SQLAlchemyConnectionField(EventObject)
#     all_users = SQLAlchemyConnectionField(UserObject)

class Query(graphene.ObjectType):
    users = graphene.List(UserObject)
    def resolve_users(self, info):
        return UserObject.get_query(info).all()

schema = graphene.Schema(query=Query)
