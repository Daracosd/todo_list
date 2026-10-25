from rest_framework.routers import DefaultRouter
from .views import TodoViewSet

router =DefaultRouter()
# Registering the viewset generates the collection and per-todo CRUD routes.
router.register('todos', TodoViewSet)

urlpatterns= router.urls
