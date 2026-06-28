from rest_framework import viewsets, status
from rest_framework.response import Response
from ..model.committee import Member
from ..serializers.memberserializer import MemberSerializer


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer

    # ✅ 1. Handle list (nested + global)
    def get_queryset(self):
        committee_id = self.kwargs.get("committee_pk")

        if committee_id:
            return Member.objects.filter(committee_id=committee_id)

        return Member.objects.all()

    # ✅ 2. Handle create (auto-attach committee when nested)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        committee_id = self.kwargs.get("committee_pk")

        if committee_id:
            serializer.save(committee_id=committee_id)
        else:
            serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ✅ 3. Update (PUT / PATCH)
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    # ✅ 4. Delete
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # ✅ 5. Retrieve single member
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
