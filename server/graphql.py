import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from .models import User, Event, Attendee
from .db import db


class UserQL(SQLAlchemyObjectType):
    class Meta:
        model = User

class AttendeeQL(SQLAlchemyObjectType):
    class Meta:
        model = Attendee

class EventQL(SQLAlchemyObjectType):
    class Meta:
        model = Event

    attendees = graphene.List(AttendeeQL)

class Query(graphene.ObjectType):
    users = graphene.List(UserQL)
    def resolve_users(self, info):
        return UserQL.get_query(info).all()

    events = graphene.List(EventQL)
    def resolve_events(self, info):
        return EventQL.get_query(info).all()


class AddUser(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
    user = graphene.Field(lambda: UserQL)

    def mutate(self, info, **kwargs):
        user = User(**kwargs)
        db.session.add(user)
        db.session.commit()
        return AddUser(user=user)

class AddEvent(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        time = graphene.DateTime(required=True)
        longtitude = graphene.Float(required=True)
        latitude = graphene.Float(required=True)
    event = graphene.Field(lambda: EventQL)

    def mutate(self, info, **kwargs):
        event = Event(**kwargs)
        db.session.add(event)
        db.session.commit()
        return AddEvent(event=event)


class AttendEvent(graphene.Mutation):
    class Arguments:
        event_id = graphene.Int(required=True)
        user_id = graphene.Int(required=True)
        is_driver = graphene.Boolean(required=True)
        capacity = graphene.Int(required=True)
        pick_up_longtitude = graphene.Float(required=True)
        pick_up_latitude = graphene.Float(required=True)
        gender = graphene.Int(required=True)
    attendee = graphene.Field(lambda: AttendeeQL)

    def mutate(self, info, **kwargs):
        event = Event.query.filter_by(id=kwargs["event_id"]).first()
        assert kwargs["user_id"] not in (attendee.user_id for attendee in event.attendees), "This user is already attending this event"
        attendee = Attendee(**kwargs)
        event.attendees.append(attendee)
        db.session.add(event)
        db.session.commit()
        return AttendEvent(attendee=attendee)


class Mutation(graphene.ObjectType):
    add_user = AddUser.Field()
    add_event = AddEvent.Field()
    attend_event = AttendEvent.Field()


schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
)
